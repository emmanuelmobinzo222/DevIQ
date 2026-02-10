# RideShare - Complete Deployment Guide

## 🚀 Deployment Options

### Option 1: Emergent Platform (Recommended for Quick Launch)

Your app is already deployed on Emergent at:
- **URL**: Your workspace URL on Emergent platform
- **Status**: Live and accessible via mobile browsers
- **Features**: Auto-scaling, HTTPS, monitoring included

#### Accessing Your Deployed App:
1. Log into your Emergent dashboard
2. Navigate to your RideShare workspace
3. Copy the public URL
4. Share this URL with users
5. Users can access via any mobile browser
6. Users can "Add to Home Screen" for app-like experience

#### PWA Installation Instructions for Users:

**On iPhone (Safari):**
1. Open the RideShare URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

**On Android (Chrome):**
1. Open the RideShare URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

---

### Option 2: Custom Domain Deployment

#### A. Configure Custom Domain

1. **Purchase Domain** (e.g., rideshare.app)
   - Recommended: Namecheap, GoDaddy, Google Domains

2. **Update DNS Records**
   ```
   Type: CNAME
   Name: @
   Value: [Your Emergent URL]
   TTL: 3600
   
   Type: CNAME
   Name: www
   Value: [Your Emergent URL]
   TTL: 3600
   ```

3. **SSL Certificate**
   - Automatic via Emergent platform
   - Or use Let's Encrypt

---

### Option 3: Independent Hosting

#### Prerequisites:
- VPS/Cloud Server (DigitalOcean, AWS, Google Cloud)
- Ubuntu 22.04 LTS
- Domain name
- SSL certificate

#### Server Setup:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# 4. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. Install Nginx
sudo apt install -y nginx

# 6. Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### Application Deployment:

```bash
# 1. Clone/Upload your application
cd /opt
sudo mkdir rideshare
cd rideshare

# 2. Setup Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=rideshare
SECRET_KEY=$(openssl rand -hex 32)
EOF

# 3. Setup Frontend
cd ../frontend
npm install
npm run build

# 4. Create systemd service for backend
sudo cat > /etc/systemd/system/rideshare-backend.service << EOF
[Unit]
Description=RideShare Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/rideshare/backend
Environment="PATH=/opt/rideshare/backend/venv/bin"
ExecStart=/opt/rideshare/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 5. Start backend service
sudo systemctl daemon-reload
sudo systemctl start rideshare-backend
sudo systemctl enable rideshare-backend

# 6. Configure Nginx
sudo cat > /etc/nginx/sites-available/rideshare << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /opt/rideshare/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/rideshare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 7. Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔐 Environment Variables

### Backend (.env)
```bash
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=rideshare

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# Payment (Optional - for production)
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
PAYSTACK_SECRET_KEY=sk_live_xxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxx

# App Config
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

### Frontend (.env)
```bash
REACT_APP_BACKEND_URL=https://yourdomain.com
```

---

## 📊 Monitoring & Maintenance

### Log Locations:
```bash
# Backend logs
sudo journalctl -u rideshare-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Health Checks:
```bash
# Check backend
curl http://localhost:8001/api/

# Check frontend
curl http://localhost/

# Check MongoDB
mongosh --eval "db.serverStatus()"
```

### Backup Strategy:

```bash
# MongoDB backup script
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/mongodb

mkdir -p $BACKUP_DIR
mongodump --out=$BACKUP_DIR/backup_$TIMESTAMP

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /opt/scripts/mongodb-backup.sh
```

---

## 🔄 Updates & Maintenance

### Updating the Application:

```bash
# 1. Backup current version
cd /opt/rideshare
sudo tar -czf backup-$(date +%Y%m%d).tar.gz backend frontend

# 2. Pull new code
git pull origin main

# 3. Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart rideshare-backend

# 4. Update frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

### Zero-Downtime Deployment:

```bash
# Use PM2 for backend (alternative to systemd)
npm install -g pm2
pm2 start server.py --name rideshare-backend --interpreter python3
pm2 save
pm2 startup
```

---

## 🛡️ Security Checklist

### Server Security:
- [ ] Enable firewall (UFW)
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

- [ ] Setup fail2ban
  ```bash
  sudo apt install fail2ban
  sudo systemctl enable fail2ban
  ```

- [ ] Regular security updates
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

### Application Security:
- [ ] Change default SECRET_KEY
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Regular dependency updates
- [ ] Security audit logs

---

## 📈 Performance Optimization

### Frontend:
```bash
# Enable gzip compression in Nginx
location / {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Backend:
```python
# Add to server.py for caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="rideshare")
```

### Database:
```javascript
// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.rides.createIndex({ status: 1, departureTime: 1 });
db.rides.createIndex({ "origin.address": "text", "destination.address": "text" });
db.bookings.createIndex({ userId: 1, createdAt: -1 });
```

---

## 🌍 Multi-Region Deployment

For global coverage:

### Use CDN:
- Cloudflare (Recommended - Free plan available)
- AWS CloudFront
- Google Cloud CDN

### Load Balancing:
```nginx
upstream rideshare_backend {
    server backend1.yourdomain.com;
    server backend2.yourdomain.com;
    server backend3.yourdomain.com;
}

server {
    location /api {
        proxy_pass http://rideshare_backend;
    }
}
```

---

## 📱 Mobile App Distribution

### Progressive Web App (PWA):
Already configured! Users can install from browser.

### Native Apps:
See MOBILE_APP_GUIDE.md for full instructions.

Quick links:
- iOS: https://developer.apple.com/app-store/submissions/
- Android: https://play.google.com/console

---

## 💳 Payment Integration

### Production Setup:

1. **Choose Payment Provider:**
   - Stripe (Global): https://stripe.com
   - PayStack (Africa): https://paystack.com
   - Flutterwave (Africa): https://flutterwave.com

2. **Complete Verification:**
   - Business documents
   - Bank account details
   - Identity verification

3. **Get Live API Keys:**
   - Replace test keys in .env
   - Update frontend config

4. **Setup Webhooks:**
   ```bash
   # Stripe webhook URL
   https://yourdomain.com/api/webhooks/stripe
   
   # PayStack webhook URL
   https://yourdomain.com/api/webhooks/paystack
   ```

5. **Test in Production:**
   - Small test transaction
   - Verify commission split
   - Check driver payout queue

See PAYMENT_INTEGRATION_GUIDE.md for detailed setup.

---

## 🎯 Launch Checklist

### Pre-Launch:
- [ ] All tests passing
- [ ] SSL certificate active
- [ ] Payment gateway configured
- [ ] Database backups automated
- [ ] Monitoring setup (Google Analytics, Sentry)
- [ ] Error tracking enabled
- [ ] Support email configured
- [ ] Legal pages (Privacy, Terms)
- [ ] Social media accounts created

### Launch Day:
- [ ] Final production test
- [ ] Announce on social media
- [ ] Send to beta testers
- [ ] Monitor error logs
- [ ] Watch server resources
- [ ] Customer support ready

### Post-Launch:
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan feature updates
- [ ] Marketing campaigns
- [ ] Partnership outreach

---

## 📞 Support & Troubleshooting

### Common Issues:

**Backend won't start:**
```bash
# Check logs
sudo journalctl -u rideshare-backend -n 50

# Common fixes:
- Check MongoDB is running
- Verify .env file exists
- Check port 8001 is not in use
```

**Frontend shows blank page:**
```bash
# Check build
cd frontend && npm run build

# Check Nginx config
sudo nginx -t

# Check browser console for errors
```

**Database connection failed:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh

# Check firewall
sudo ufw status
```

### Getting Help:
- Email: support@rideshare.app
- Documentation: /docs
- Community: [Your community link]

---

## 🎓 Additional Resources

- [Emergent Documentation](https://docs.emergent.sh)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [MongoDB Manual](https://docs.mongodb.com)
- [Nginx Documentation](https://nginx.org/en/docs)

---

## 📄 License & Credits

**RideShare** - Travel Together, Save Together
Created for: Mwenge Emmanuel Mobinzo
Developed on: Emergent Platform
Year: 2025

All rights reserved.
