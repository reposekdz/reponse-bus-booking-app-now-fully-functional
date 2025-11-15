#!/bin/bash

# GoBus Production Deployment Script
# This script handles the complete deployment of the GoBus application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="gobus"
BACKUP_DIR="/backups/gobus"
LOG_FILE="/var/log/gobus-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if .env file exists
    if [[ ! -f .env ]]; then
        error ".env file not found. Please create it from .env.example"
    fi
    
    # Check if SSL certificates exist (for production)
    if [[ "$NODE_ENV" == "production" ]]; then
        if [[ ! -f "./nginx/ssl/cert.pem" ]] || [[ ! -f "./nginx/ssl/key.pem" ]]; then
            warning "SSL certificates not found. HTTPS will not be available."
        fi
    fi
    
    log "Prerequisites check completed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    # Create backup directory
    mkdir -p $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)
    CURRENT_BACKUP_DIR="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
    
    # Backup database
    if docker ps | grep -q gobus_mysql; then
        info "Backing up database..."
        docker exec gobus_mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > $CURRENT_BACKUP_DIR/database.sql
    fi
    
    # Backup uploads
    if docker volume ls | grep -q gobus_backend_uploads; then
        info "Backing up uploads..."
        docker run --rm -v gobus_backend_uploads:/data -v $CURRENT_BACKUP_DIR:/backup alpine tar czf /backup/uploads.tar.gz -C /data .
    fi
    
    # Backup configuration
    info "Backing up configuration..."
    cp .env $CURRENT_BACKUP_DIR/
    cp docker-compose.production.yml $CURRENT_BACKUP_DIR/
    
    log "Backup created at $CURRENT_BACKUP_DIR"
}

# Build and deploy
deploy() {
    log "Starting deployment..."
    
    # Pull latest images
    info "Pulling latest images..."
    docker-compose -f docker-compose.production.yml pull
    
    # Build custom images
    info "Building application images..."
    docker-compose -f docker-compose.production.yml build --no-cache
    
    # Stop existing containers
    info "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down
    
    # Start new containers
    info "Starting new containers..."
    docker-compose -f docker-compose.production.yml up -d
    
    # Wait for services to be ready
    info "Waiting for services to be ready..."
    sleep 30
    
    # Run health checks
    health_check
    
    log "Deployment completed successfully"
}

# Health check
health_check() {
    log "Running health checks..."
    
    # Check backend health
    for i in {1..30}; do
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            info "Backend is healthy"
            break
        fi
        if [[ $i -eq 30 ]]; then
            error "Backend health check failed"
        fi
        sleep 2
    done
    
    # Check frontend
    for i in {1..30}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            info "Frontend is accessible"
            break
        fi
        if [[ $i -eq 30 ]]; then
            error "Frontend health check failed"
        fi
        sleep 2
    done
    
    # Check database
    if docker exec gobus_mysql mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD > /dev/null 2>&1; then
        info "Database is healthy"
    else
        error "Database health check failed"
    fi
    
    # Check Redis
    if docker exec gobus_redis redis-cli ping > /dev/null 2>&1; then
        info "Redis is healthy"
    else
        error "Redis health check failed"
    fi
    
    log "All health checks passed"
}

# Rollback function
rollback() {
    log "Starting rollback..."
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    if [[ -z "$LATEST_BACKUP" ]]; then
        error "No backup found for rollback"
    fi
    
    info "Rolling back to backup: $LATEST_BACKUP"
    
    # Stop current containers
    docker-compose -f docker-compose.production.yml down
    
    # Restore database
    if [[ -f "$BACKUP_DIR/$LATEST_BACKUP/database.sql" ]]; then
        info "Restoring database..."
        docker-compose -f docker-compose.production.yml up -d mysql
        sleep 10
        docker exec -i gobus_mysql mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE < $BACKUP_DIR/$LATEST_BACKUP/database.sql
    fi
    
    # Restore uploads
    if [[ -f "$BACKUP_DIR/$LATEST_BACKUP/uploads.tar.gz" ]]; then
        info "Restoring uploads..."
        docker run --rm -v gobus_backend_uploads:/data -v $BACKUP_DIR/$LATEST_BACKUP:/backup alpine tar xzf /backup/uploads.tar.gz -C /data
    fi
    
    # Start all services
    docker-compose -f docker-compose.production.yml up -d
    
    log "Rollback completed"
}

# Cleanup old backups (keep last 7 days)
cleanup_backups() {
    log "Cleaning up old backups..."
    find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
    log "Backup cleanup completed"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Create monitoring directories
    mkdir -p monitoring/{prometheus,grafana/{dashboards,datasources},logstash/pipeline}
    
    # Create Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'gobus-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'mysql'
    static_configs:
      - targets: ['mysql:3306']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF
    
    log "Monitoring setup completed"
}

# Main execution
main() {
    log "Starting GoBus production deployment"
    
    # Load environment variables
    source .env
    
    case "${1:-deploy}" in
        "deploy")
            check_root
            check_prerequisites
            create_backup
            setup_monitoring
            deploy
            cleanup_backups
            ;;
        "rollback")
            check_root
            rollback
            ;;
        "backup")
            create_backup
            ;;
        "health")
            health_check
            ;;
        "logs")
            docker-compose -f docker-compose.production.yml logs -f
            ;;
        "stop")
            log "Stopping all services..."
            docker-compose -f docker-compose.production.yml down
            ;;
        "restart")
            log "Restarting all services..."
            docker-compose -f docker-compose.production.yml restart
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|backup|health|logs|stop|restart}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Deploy the application (default)"
            echo "  rollback - Rollback to the latest backup"
            echo "  backup   - Create a backup"
            echo "  health   - Run health checks"
            echo "  logs     - Show application logs"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            exit 1
            ;;
    esac
    
    log "Operation completed successfully"
}

# Run main function
main "$@"