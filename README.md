# 🎨 LogisticsPro Frontend

Modern, responsive admin dashboard for LogisticsPro - A comprehensive logistics management system built with React and CoreUI.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Deployment](#docker-deployment)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

- 🎨 **Modern UI** - Built with CoreUI Pro v4 components
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - Token-based authentication with auto-logout
- 📊 **Rich Data Tables** - Advanced sorting, filtering, and export capabilities
- 📈 **Interactive Charts** - Real-time data visualization
- 🔔 **Real-time Notifications** - Socket.io integration for live updates
- 📥 **Export Functionality** - Export data to CSV, Excel, PDF
- 🖨️ **Print Support** - Print-friendly views for reports
- 🌐 **Multi-language Ready** - Internationalization support
- 🎯 **Role-based UI** - Dynamic UI based on user permissions
- 📸 **Image Capture** - Webcam integration for document capture
- 🎨 **Theming** - Customizable color schemes

---

## 🛠️ Tech Stack

- **Framework**: React 17
- **UI Library**: CoreUI v4 (Pro)
- **State Management**: Redux
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js
- **Tables**: React Data Table Component
- **Forms**: React Hook Form (implied)
- **Styling**: SCSS/SASS
- **Icons**: CoreUI Icons
- **Real-time**: Socket.io
- **Notifications**: React Toastify
- **QR Codes**: React QR Code
- **Date Handling**: date-fns

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 14.x (LTS recommended)
- **npm** >= 6.x or **yarn** >= 1.22.x
- **Git**

### Check Versions
```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/logistics-pro-frontend.git
cd logistics-pro-frontend
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your API endpoint:
```env
REACT_APP_BASEURL=http://127.0.0.1:8000/api/v1
REACT_APP_BASEURL1=http://127.0.0.1:8000/api/v1/
REACT_APP_NLFS_DIESEL_VENDOR=231564
REACT_APP_NLFS_DIESEL_MATERIAL_CODE=SS126568
```

---

## 🐳 Docker Deployment

### Quick Start with Docker

The easiest way to run the frontend is using Docker. No need to install Node.js locally!

#### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

#### Option 1: Development with Docker (Hot Reload)

```bash
# Clone the repository
git clone https://github.com/sakthibalaji-naga/logistics-pro-frontend.git
cd logistics-pro-frontend

# Copy environment file
cp .env.example .env

# Edit .env with your backend API URL
# REACT_APP_BASEURL=http://localhost:8000/api/v1
# REACT_APP_BASEURL1=http://localhost:8000/api/v1/

# Start development server with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

**Access:** http://localhost:3000

**Features:**
- ✅ Hot reload - code changes instantly reflected
- ✅ Volume mounting - edit code on host machine
- ✅ Fast refresh - React Fast Refresh enabled
- ✅ No local Node.js installation needed

**Development Workflow:**
```bash
# Your code changes will auto-reload in the browser!
# Edit files in src/ and see instant updates

# Install new packages
docker exec logisticspro_frontend_dev npm install package-name

# Run tests
docker exec logisticspro_frontend_dev npm test

# Access container shell
docker exec -it logisticspro_frontend_dev sh
```

#### Option 2: Production with Docker

```bash
# Clone the repository
git clone https://github.com/sakthibalaji-naga/logistics-pro-frontend.git
cd logistics-pro-frontend

# Copy and configure environment
cp .env.example .env
# Edit .env with production API URL

# Build production image (multi-stage optimized)
docker-compose build

# Start production server
docker-compose up -d
```

**Access:** http://localhost:3000

**Features:**
- ✅ Multi-stage Docker build - minimal image size
- ✅ Optimized Nginx configuration
- ✅ Gzip compression enabled
- ✅ Browser caching configured
- ✅ Security headers included
- ✅ Health check endpoint

#### Option 3: Full Stack with Backend (Recommended)

Run both frontend and backend together:

```bash
# Create project directory
mkdir logisticspro-fullstack
cd logisticspro-fullstack

# Clone both repositories
git clone https://github.com/Naga-Limited/logistics-pro-backend.git backend
git clone https://github.com/sakthibalaji-naga/logistics-pro-frontend.git frontend

# Create docker-compose.yml for full stack
# (See Full Stack Configuration below)

# Start everything
docker-compose up -d

# Initialize backend
docker exec backend php artisan migrate
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PhpMyAdmin: http://localhost:8080

### Docker Services

| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| Frontend | logisticspro_frontend | 3000 | React application |

### Common Docker Commands

```bash
# View running containers
docker ps

# View logs (follow mode)
docker logs -f logisticspro_frontend

# Access container shell
docker exec -it logisticspro_frontend sh

# Install npm packages (dev mode)
docker exec logisticspro_frontend_dev npm install

# Restart container
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View container resource usage
docker stats logisticspro_frontend
```

### Environment Variables in Docker

When building production Docker images, pass environment variables as build arguments:

```bash
# Build with custom API URL
docker build \
  --build-arg REACT_APP_BASEURL=https://api.yourdomain.com/api/v1 \
  --build-arg REACT_APP_BASEURL1=https://api.yourdomain.com/api/v1/ \
  -t logisticspro-frontend:latest .

# Run with environment variables
docker run -d \
  -p 3000:80 \
  -e NODE_ENV=production \
  logisticspro-frontend:latest
```

### Full Stack Configuration

Create `docker-compose.fullstack.yml`:

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: logisticspro
      MYSQL_USER: logisticspro
      MYSQL_PASSWORD: secret
    volumes:
      - mysql_data:/var/lib/mysql

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # Backend API
  backend:
    image: logisticspro-backend:latest
    ports:
      - "8000:80"
    environment:
      - DB_HOST=mysql
      - DB_DATABASE=logisticspro
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  # Frontend
  frontend:
    image: logisticspro-frontend:latest
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Troubleshooting Docker

#### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:80"  # Change 3000 to 3001
```

#### Build Fails
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

#### Hot Reload Not Working (Windows)
```bash
# Enable polling in docker-compose.dev.yml
environment:
  - CHOKIDAR_USEPOLLING=true
```

#### Container Exits Immediately
```bash
# Check logs for errors
docker logs logisticspro_frontend

# Verify Dockerfile syntax
docker build --no-cache .
```

#### API Connection Issues
```bash
# Verify backend is running
curl http://localhost:8000

# Check CORS configuration in backend
# Ensure frontend domain is allowed

# Verify environment variables
docker exec logisticspro_frontend_dev env | grep REACT_APP
```

#### Out of Disk Space
```bash
# Remove unused Docker resources
docker system prune -a

# Remove specific images
docker rmi $(docker images -q logisticspro*)
```

### Docker Files Overview

- **Dockerfile** - Production build (multi-stage, optimized)
- **Dockerfile.dev** - Development build (hot reload)
- **docker-compose.yml** - Production container
- **docker-compose.dev.yml** - Development container
- **docker/nginx/nginx.conf** - Nginx configuration for SPA
- **.dockerignore** - Files excluded from build

### Production Build Optimization

The production Dockerfile uses multi-stage builds:

**Stage 1: Build**
- Install dependencies
- Build React app
- Optimize assets

**Stage 2: Serve**
- Lightweight Nginx Alpine image
- Copy only built files
- Configured for SPA routing
- Gzip compression
- Security headers

**Result:** Small image size (~50MB vs ~1GB)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

#### Development
```env
# API Configuration
REACT_APP_BASEURL=http://127.0.0.1:8000/api/v1
REACT_APP_BASEURL1=http://127.0.0.1:8000/api/v1/

# Application Settings
REACT_APP_NLFS_DIESEL_VENDOR=231564
REACT_APP_NLFS_DIESEL_MATERIAL_CODE=SS126568

# Optional: Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true
```

#### UAT/Staging
```env
REACT_APP_BASEURL=https://logiprouat.nagamills.com/LP_API/api/v1
REACT_APP_BASEURL1=https://logiprouat.nagamills.com/LP_API/api/v1/
REACT_APP_NLFS_DIESEL_VENDOR=231564
REACT_APP_NLFS_DIESEL_MATERIAL_CODE=SS126568
```

#### Production
```env
REACT_APP_BASEURL=https://logisticspro.nagamills.com/LP_API/api/v1
REACT_APP_BASEURL1=https://logisticspro.nagamills.com/LP_API/api/v1/
REACT_APP_NLFS_DIESEL_VENDOR=410198
REACT_APP_NLFS_DIESEL_MATERIAL_CODE=SS128473
```

### API Configuration

The API base URL is configured in [src/AppConfig.js](src/AppConfig.js):
```javascript
const AppConfig = {
  version: '1.0.0',
  api: { 
    baseUrl: process.env.REACT_APP_BASEURL 
  }
}
```

---

## 🏃 Running the Application

### Development Server
```bash
# Using npm
npm start

# OR using yarn
yarn start
```

Application will open at: `http://localhost:3000`

### Custom Port
```bash
# Linux/Mac
PORT=3001 npm start

# Windows
set PORT=3001 && npm start
```

### Development with Increased Memory (if needed)
```bash
npm start
# Script already includes: --max_old_space_size=8128
```

---

## 📁 Project Structure

```
logistics-pro-frontend/
├── public/                     # Static files
│   ├── assets/                 # Public assets
│   ├── index.html              # HTML template
│   └── favicon.ico             # Favicon
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable components
│   │   ├── AppHeader.js
│   │   ├── AppSidebar.js
│   │   └── ...
│   ├── Hooks/                  # Custom React hooks
│   ├── layout/                 # Layout components
│   ├── Pages/                  # Page components
│   │   ├── Dashboard/
│   │   ├── Vehicles/
│   │   ├── Drivers/
│   │   └── ...
│   ├── redux/                  # Redux store & slices
│   │   ├── store.js
│   │   └── slices/
│   ├── scss/                   # SCSS stylesheets
│   │   ├── style.scss
│   │   └── _custom.scss
│   ├── Service/                # API service functions
│   │   ├── AuthService.js
│   │   └── ...
│   ├── Utils/                  # Utility functions
│   ├── Validations/            # Form validation schemas
│   ├── App.js                  # Main App component
│   ├── AppConfig.js            # App configuration
│   ├── AutoLogoutTimer.js      # Session management
│   ├── RouteChild.js           # Route definitions
│   ├── routes.js               # Route configuration
│   ├── _nav.js                 # Navigation structure
│   ├── index.js                # Entry point
│   └── store.js                # Redux store setup
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .eslintrc.js                # ESLint configuration
├── .prettierrc.js              # Prettier configuration
├── jsconfig.json               # JavaScript configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## 🔧 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run lint`
Runs ESLint to check code quality.

### `npm run eject`
⚠️ **Warning**: This is a one-way operation. Use with caution!

---

## 🏗️ Building for Production

### Create Production Build
```bash
npm run build
```

This will:
- Optimize the build for best performance
- Minify files
- Hash filenames for caching
- Create a `build/` directory ready for deployment

### Test Production Build Locally
```bash
# Install serve globally
npm install -g serve

# Serve the build directory
serve -s build -l 3000
```

---

## 🚢 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Drag and drop the 'build' folder to Netlify
# OR use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Deploy to Nginx
```bash
# Build the project
npm run build

# Copy build files to Nginx directory
sudo cp -r build/* /var/www/html/

# Nginx configuration (example)
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Production Checklist

- [ ] Set production API URL in `.env.production.local`
- [ ] Remove console logs and debug code
- [ ] Test all features in production build
- [ ] Configure proper CORS on backend
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure proper error tracking (Sentry, etc.)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Optimize images and assets
- [ ] Test on multiple browsers and devices
- [ ] Configure proper caching headers

---

## 🎯 Key Features Guide

### Authentication
- Automatic token refresh
- Auto-logout on inactivity (configurable in `AutoLogoutTimer.js`)
- Protected routes based on user roles

### Data Export
```javascript
// Export to CSV
import { CSVLink } from 'react-csv';

<CSVLink data={data} filename="report.csv">
  Export CSV
</CSVLink>
```

### Print Functionality
```javascript
// Print component
import ReactToPrint from 'react-to-print';

<ReactToPrint
  trigger={() => <button>Print</button>}
  content={() => componentRef.current}
/>
```

### Real-time Updates
```javascript
// Socket.io integration
import io from 'socket.io-client';

const socket = io(SOCKET_URL);
socket.on('notification', (data) => {
  // Handle real-time notification
});
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Debug Tests
```bash
npm run test:debug
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find and kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

#### Module Not Found Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails Due to Memory
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

#### CORS Issues
- Verify backend CORS configuration allows your frontend URL
- Check API base URL in `.env` is correct
- Ensure backend is running

#### API Connection Error
- Verify backend is running
- Check network console for error details
- Verify API URL in `.env` file
- Check if backend CORS allows frontend origin

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Follow ESLint rules (`.eslintrc.js`)
- Use Prettier for code formatting
- Write meaningful component and variable names
- Add comments for complex logic
- Keep components small and focused

---

## 📝 License

This project is proprietary and confidential.

---

## 📞 Support

For support and questions:
- **Email**: support@logisticspro.com
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/logistics-pro-frontend/issues)

---

## 🔗 Related Repositories

- **Backend API**: [logistics-pro-backend](https://github.com/YOUR_USERNAME/logistics-pro-backend)

---

## 📈 Version History

- **v1.0.0** - Initial Release
  - Complete logistics management dashboard
  - Real-time notifications
  - Export and print functionality
  - Responsive design

---

## 🙏 Acknowledgments

- Built with [CoreUI](https://coreui.io/)
- Powered by [React](https://reactjs.org/)
- Icons by [CoreUI Icons](https://icons.coreui.io/)

---

**Made with ❤️ by the LogisticsPro Team**
