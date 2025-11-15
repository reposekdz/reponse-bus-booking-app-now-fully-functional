# GoBus Production Deployment Guide

This guide provides comprehensive instructions for deploying the GoBus application in a production environment with advanced features, monitoring, and security.

## 🚀 Features

### Core Features
- **Real-time Bus Booking System** with seat selection
- **Multi-role Support** (Passengers, Drivers, Companies, Agents, Admin)
- **Live GPS Tracking** with real-time updates
- **Digital Wallet System** with secure transactions
- **Loyalty Program** with points and rewards
- **Package Delivery Service** integration
- **Lost & Found System** with automated matching
- **Multi-language Support** (English, Kinyarwanda, French)
- **Push Notifications** via Firebase
- **SMS & Email Notifications**
- **Dynamic Pricing** based on demand
- **Charter Bus Booking** for groups
- **Corporate Travel Management**
- **Advanced Analytics & Reporting**

### Technical Features
- **Blockchain Integration** for secure transactions
- **AI-Powered Recommendations**
- **Advanced Security** with rate limiting, SQL injection protection
- **Comprehensive Logging** with ELK stack
- **Health Monitoring** with Prometheus & Grafana
- **Auto-scaling** with Docker Swarm/Kubernetes ready
- **SSL/TLS Encryption**
- **Database Replication** support
- **Redis Caching** for performance
- **File Upload** with cloud storage integration

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **RAM**: Minimum 8GB (16GB recommended)
- **CPU**: 4 cores minimum (8 cores recommended)
- **Storage**: 100GB SSD minimum
- **Network**: Static IP with domain name

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- Node.js 18+ (for development)
- MySQL 8.0+
- Redis 7.0+
- Nginx 1.20+

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-org/gobus.git
cd gobus
```

### 2. Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit configuration
nano backend/.env
```

### Required Environment Variables
```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database Configuration
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=gobus_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=gobus_production
MYSQL_ROOT_PASSWORD=your_root_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here

# External Services
STRIPE_SECRET_KEY=sk_live_your_stripe_key
TWILIO_ACCOUNT_SID=your_twilio_sid
FIREBASE_PROJECT_ID=your_firebase_project
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Monitoring
GRAFANA_PASSWORD=your_grafana_password
```

### 3. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Option 1: Let's Encrypt (Recommended)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Option 2: Self-signed (Development only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

### 4. Deploy Application
```bash
# Make deployment script executable
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh deploy
```

## 🔍 Monitoring & Logging

### Access Monitoring Dashboards
- **Application Health**: https://yourdomain.com/health
- **Grafana Dashboard**: https://yourdomain.com:3001
- **Prometheus Metrics**: https://yourdomain.com:9090
- **Kibana Logs**: https://yourdomain.com:5601

### Key Metrics Monitored
- **Application Performance**: Response times, throughput
- **Database Performance**: Query times, connections
- **System Resources**: CPU, Memory, Disk usage
- **Business Metrics**: Bookings, revenue, user activity
- **Security Events**: Failed logins, suspicious activity

## 🛡️ Security Features

### Authentication & Authorization
- **JWT-based Authentication** with refresh tokens
- **Role-based Access Control** (RBAC)
- **Multi-factor Authentication** (MFA) support
- **Session Management** with Redis
- **Password Policies** with complexity requirements

### Security Middleware
- **Rate Limiting** to prevent abuse
- **SQL Injection Protection**
- **XSS Protection** with input sanitization
- **CSRF Protection** for state-changing operations
- **Helmet.js** for security headers
- **IP Whitelisting** for admin access

### Data Protection
- **Encryption at Rest** for sensitive data
- **TLS 1.3** for data in transit
- **PII Anonymization** in logs
- **GDPR Compliance** features
- **Audit Logging** for all actions

## 📊 Database Schema

### Core Tables
- **users**: User accounts and profiles
- **companies**: Bus companies
- **buses**: Fleet management
- **routes**: Travel routes
- **trips**: Scheduled trips
- **bookings**: Ticket bookings
- **payments**: Payment transactions
- **wallets**: Digital wallet system
- **loyalty_transactions**: Loyalty points
- **notifications**: Push notifications
- **lost_and_found**: Lost items tracking

### Advanced Features Tables
- **price_alerts**: Dynamic pricing
- **charters**: Charter bookings
- **packages**: Package delivery
- **reviews**: User reviews
- **promotions**: Marketing campaigns
- **analytics**: Business intelligence
- **audit_logs**: Security auditing

## 🔄 Backup & Recovery

### Automated Backups
```bash
# Daily backup (add to crontab)
0 2 * * * /path/to/gobus/deploy-production.sh backup

# Weekly full backup
0 1 * * 0 /path/to/gobus/backup-full.sh
```

### Manual Backup
```bash
# Create backup
./deploy-production.sh backup

# Restore from backup
./deploy-production.sh rollback
```

### Disaster Recovery
1. **Database Replication**: Master-slave setup
2. **File Synchronization**: rsync to backup server
3. **Container Registry**: Push images to registry
4. **Infrastructure as Code**: Terraform/Ansible scripts

## 🚀 Scaling & Performance

### Horizontal Scaling
```bash
# Scale backend services
docker-compose -f docker-compose.production.yml up -d --scale backend=3

# Load balancer configuration
# Update nginx.conf for multiple backend instances
```

### Performance Optimization
- **Redis Caching**: Session, query results
- **CDN Integration**: Static assets delivery
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient DB connections
- **Gzip Compression**: Reduced bandwidth

### Kubernetes Deployment (Advanced)
```bash
# Convert to Kubernetes
kompose convert -f docker-compose.production.yml

# Deploy to cluster
kubectl apply -f gobus-k8s/
```

## 🔧 Maintenance

### Regular Tasks
```bash
# Update application
git pull origin main
./deploy-production.sh deploy

# Check system health
./deploy-production.sh health

# View logs
./deploy-production.sh logs

# Restart services
./deploy-production.sh restart
```

### Database Maintenance
```bash
# Optimize tables
docker exec gobus_mysql mysqlcheck -o --all-databases -u root -p

# Update statistics
docker exec gobus_mysql mysql -u root -p -e "ANALYZE TABLE bookings, trips, users;"
```

## 🐛 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs service_name

# Check system resources
docker stats

# Restart specific service
docker-compose -f docker-compose.production.yml restart service_name
```

#### Database Connection Issues
```bash
# Check MySQL status
docker exec gobus_mysql mysqladmin status -u root -p

# Test connection
docker exec gobus_backend npm run test:db
```

#### Performance Issues
```bash
# Check resource usage
htop
iotop
nethogs

# Analyze slow queries
docker exec gobus_mysql mysqldumpslow /var/log/mysql/slow.log
```

## 📞 Support

### Emergency Contacts
- **System Administrator**: admin@yourcompany.com
- **Database Administrator**: dba@yourcompany.com
- **Security Team**: security@yourcompany.com

### Documentation
- **API Documentation**: https://yourdomain.com/api/docs
- **User Manual**: https://docs.yourcompany.com/gobus
- **Developer Guide**: https://dev.yourcompany.com/gobus

### Monitoring Alerts
- **PagerDuty**: Critical system alerts
- **Slack**: #gobus-alerts channel
- **Email**: alerts@yourcompany.com

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📈 Roadmap

### Upcoming Features
- **Mobile App**: React Native application
- **AI Chatbot**: Customer support automation
- **IoT Integration**: Smart bus sensors
- **Blockchain Payments**: Cryptocurrency support
- **Machine Learning**: Predictive analytics
- **Voice Commands**: Alexa/Google Assistant

### Performance Goals
- **99.9% Uptime**: High availability
- **<200ms Response Time**: Fast API responses
- **1M+ Users**: Scalable architecture
- **24/7 Support**: Round-the-clock monitoring

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Maintainer**: GoBus Development Team