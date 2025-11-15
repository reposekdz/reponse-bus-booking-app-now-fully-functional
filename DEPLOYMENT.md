# GoBus Production Deployment Guide

This guide covers the complete deployment process for the GoBus bus booking platform, including backend, frontend, and mobile applications.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web App       │    │   Admin Panel   │
│  (React Native) │    │   (React)       │    │   (React)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Load Balancer │
                    │    (Nginx)      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   (Node.js)     │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     MySQL       │    │     Redis       │    │   File Storage  │
│   (Database)    │    │    (Cache)      │    │   (Uploads)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+
- Redis 6.0+
- Nginx (for production)
- SSL Certificate (Let's Encrypt recommended)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd reponse-bus-booking
chmod +x deploy.sh
```

### 2. Environment Configuration

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend environment
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### 3. Deploy

```bash
# Traditional deployment
./deploy.sh deploy

# Docker deployment
./deploy.sh docker
```

## 📋 Detailed Setup

### Backend Configuration

#### Required Environment Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database
MYSQL_HOST=localhost
MYSQL_USER=gobus_user
MYSQL_PASSWORD=secure_password
MYSQL_DATABASE=gobus_production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Security
JWT_SECRET=your-256-bit-secret
SESSION_SECRET=your-session-secret

# External Services
STRIPE_SECRET_KEY=sk_live_...
TWILIO_ACCOUNT_SID=AC...
EMAIL_USER=noreply@yourdomain.com
```

#### Database Setup

```bash
# Create database and user
mysql -u root -p << EOF
CREATE DATABASE gobus_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gobus_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON gobus_production.* TO 'gobus_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Run migrations
cd backend
npm run migrate
```

#### Redis Setup

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Frontend Configuration

#### Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Files will be in dist/ directory
```

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO Proxy
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static Files
    location / {
        root /var/www/gobus/backend/public;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # File Uploads
    location /uploads/ {
        root /var/www/gobus/backend;
        expires 30d;
        add_header Cache-Control "public";
    }
}

# HTTP to HTTPS Redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Mobile App Deployment

#### iOS Deployment

```bash
cd mobile

# Install dependencies
npm install

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### Android Deployment

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## 🐳 Docker Deployment

### Docker Compose Setup

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    depends_on:
      - mysql
      - redis
    restart: unless-stopped
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/schema.mysql.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./backend/public:/var/www/html
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend service
docker-compose up -d --scale backend=3
```

## 🔧 System Configuration

### Systemd Service

```ini
[Unit]
Description=GoBus Backend Service
After=network.target mysql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/gobus/backend
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/gobus/backend/uploads /var/www/gobus/backend/logs

[Install]
WantedBy=multi-user.target
```

### Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/gobus

/var/www/gobus/backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload gobus
    endscript
}
```

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Check application health
curl -f http://localhost:5000/health

# Check all services
./deploy.sh health
```

### Performance Monitoring

```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-server-monit

# Start with PM2
pm2 start backend/dist/server.js --name gobus-backend
pm2 startup
pm2 save
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

# Database backup
mysqldump -u gobus_user -p gobus_production > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz backend/uploads/

# Upload to cloud storage (implement based on your provider)
```

## 🔒 Security Checklist

- [ ] SSL/TLS certificates installed and configured
- [ ] Firewall configured (only necessary ports open)
- [ ] Database access restricted to application server
- [ ] Redis password protected
- [ ] Environment variables secured
- [ ] File upload restrictions in place
- [ ] Rate limiting configured
- [ ] Security headers implemented
- [ ] Regular security updates scheduled
- [ ] Backup and recovery procedures tested

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Check connection
   mysql -u gobus_user -p -h localhost gobus_production
   ```

2. **Redis Connection Failed**
   ```bash
   # Check Redis status
   sudo systemctl status redis-server
   
   # Test connection
   redis-cli -a your_password ping
   ```

3. **High Memory Usage**
   ```bash
   # Monitor memory
   htop
   
   # Check Node.js memory
   pm2 monit
   ```

4. **Slow API Responses**
   ```bash
   # Check logs
   tail -f backend/logs/combined.log
   
   # Monitor database queries
   mysql -u root -p -e "SHOW PROCESSLIST;"
   ```

### Log Locations

- Application logs: `/var/www/gobus/backend/logs/`
- Nginx logs: `/var/log/nginx/`
- MySQL logs: `/var/log/mysql/`
- System logs: `/var/log/syslog`

## 📞 Support

For deployment issues or questions:
- Email: devops@gobus.com
- Documentation: https://docs.gobus.com
- Status Page: https://status.gobus.com

## 📝 License

This deployment guide is part of the GoBus project. See LICENSE file for details.