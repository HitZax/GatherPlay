# GatherPlay Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Database/storage configured (if needed)
- [ ] Domain name ready
- [ ] SSL certificate ready

## 🚀 Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, etc.)

#### Server Setup

1. **Provision Server**
   ```bash
   # Ubuntu 22.04 LTS recommended
   # Minimum: 2GB RAM, 2 vCPUs
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/GatherPlay.git
   cd GatherPlay
   npm install
   ```

5. **Build Project**
   ```bash
   npm run build
   ```

6. **Configure Environment**
   ```bash
   # server/.env
   PORT=3001
   NODE_ENV=production
   CLIENT_URL=https://yourdomain.com
   CORS_ORIGIN=https://yourdomain.com
   
   # client/.env
   VITE_SERVER_URL=https://api.yourdomain.com
   ```

7. **Start with PM2**
   ```bash
   pm2 start server/dist/index.js --name gatherplay-server
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx**
   ```nginx
   # /etc/nginx/sites-available/gatherplay
   
   # Frontend
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           root /path/to/GatherPlay/client/dist;
           try_files $uri $uri/ /index.html;
       }
   }
   
   # Backend API
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

9. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

### Option 2: Docker Deployment

1. **Create Dockerfiles**

   **server/Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   COPY shared/package*.json ./shared/
   COPY server/package*.json ./server/
   
   RUN npm install
   
   COPY shared ./shared
   COPY server ./server
   
   RUN npm run build --workspace=server
   RUN npm run build --workspace=shared
   
   EXPOSE 3001
   
   CMD ["npm", "start"]
   ```

   **client/Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   
   COPY package*.json ./
   COPY shared/package*.json ./shared/
   COPY client/package*.json ./client/
   
   RUN npm install
   
   COPY shared ./shared
   COPY client ./client
   
   RUN npm run build --workspace=client
   
   FROM nginx:alpine
   COPY --from=builder /app/client/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Docker Compose**
   ```yaml
   version: '3.8'
   
   services:
     server:
       build:
         context: .
         dockerfile: server/Dockerfile
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - PORT=3001
       restart: unless-stopped
   
     client:
       build:
         context: .
         dockerfile: client/Dockerfile
       ports:
         - "80:80"
       depends_on:
         - server
       restart: unless-stopped
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Option 3: Vercel + Railway (Easiest)

#### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit vercel.com
   - Import your GitHub repository
   - Set build settings:
     - Build Command: `cd client && npm install && npm run build`
     - Output Directory: `client/dist`
     - Install Command: `npm install`

3. **Environment Variables**
   ```
   VITE_SERVER_URL=https://your-railway-app.railway.app
   ```

#### Backend (Railway)

1. **Visit railway.app**

2. **New Project → Deploy from GitHub**

3. **Configuration**
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-vercel-app.vercel.app
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

5. **Enable Public Networking**

### Option 4: AWS (Scalable)

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init gatherplay --platform node.js --region us-east-1
   ```

3. **Create Environment**
   ```bash
   eb create gatherplay-prod
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### Using AWS ECS + Fargate

1. Build and push Docker images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Setup load balancer
6. Configure auto-scaling

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, etc.)

2. **HTTPS**
   - Always use SSL in production
   - Redirect HTTP to HTTPS

3. **CORS**
   - Restrict origins to your domain
   - Don't use `*` in production

4. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Use libraries like `express-rate-limit`

5. **Monitoring**
   - Setup error tracking (Sentry)
   - Monitor server resources
   - Log important events

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 status
```

### Log Management

```bash
# Setup log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to server
        run: |
          # Your deployment script here
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Use Redis for session storage
- Implement sticky sessions for Socket.IO
- Use a load balancer
- Consider WebSocket clustering

### Performance Optimization

- Enable gzip compression
- Implement CDN for static assets
- Use database connection pooling
- Cache frequently accessed data
- Optimize Socket.IO event handling

## 🆘 Troubleshooting

### Common Issues

1. **Socket.IO Connection Failed**
   - Check CORS settings
   - Verify WebSocket support
   - Check firewall rules

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify environment variables

3. **Performance Issues**
   - Monitor server resources
   - Check for memory leaks
   - Optimize database queries
   - Implement caching

## 📞 Support

For deployment issues, contact:
- Email: support@gatherplay.com
- GitHub Issues: https://github.com/yourusername/GatherPlay/issues
