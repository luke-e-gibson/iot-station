# Weather Station - IoT Platform

Complete IoT weather station with web dashboard and REST API.

## 🚀 Quick Deploy (Raspberry Pi 5)

### One-Command Setup
```bash
# Copy environment file
cp .env.example .env

# Build and start
docker compose up -d

# View logs
docker compose logs -f
```

### Access
- **Web Dashboard:** http://localhost:3000
- **API:** http://localhost:3000/api

## 📋 Prerequisites

- Raspberry Pi 5 (4GB RAM)
- Docker & Docker Compose installed
- 32GB+ microSD card

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed installation instructions.

## 🎯 Features

- ✅ **User Authentication** - Secure login/register
- ✅ **Device Management** - Create and manage IoT devices
- ✅ **API Tokens** - Generate tokens for device authentication
- ✅ **Data Collection** - REST API for submitting sensor data
- ✅ **Web Dashboard** - View devices and data in real-time
- ✅ **PostgreSQL Database** - Reliable data storage
- ✅ **Docker Deployment** - Easy setup with Docker Compose

## 🛠️ Project Structure

```
weather-station/
├── server/                 # Application code
│   ├── src/
│   │   ├── api/           # REST API routes
│   │   ├── services/      # Business logic
│   │   ├── db/            # Database schema
│   │   └── client/        # React SSR frontend
│   ├── Dockerfile         # Docker build config
│   └── package.json
├── docker-compose.yml     # Container orchestration
├── init-db.sql           # Database initialization
├── .env.example          # Environment template
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🔧 Management Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose stop

# Restart services
docker compose restart

# View logs
docker compose logs -f

# Stop and remove (⚠️ removes data)
docker compose down -v
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/token/create` - Create device token

### Devices
- `POST /api/device/create` - Create device
- `POST /api/device/list` - List devices
- `POST /api/device/data/get` - Get device data
- `POST /api/device/data/submit` - Submit sensor data

### Example: Submit Weather Data
```bash
curl -X POST http://localhost:3000/api/device/data/submit \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "your-token-here",
    "deviceId": "your-device-id",
    "data": {
      "temperature": 22.5,
      "humidity": 65,
      "pressure": 1013.25
    }
  }'
```

## 🔐 Security

**⚠️ Important:** Change default password before deploying to production!

Edit `.env`:
```env
POSTGRES_PASSWORD=your_secure_password_here
```

## 📈 Monitoring

```bash
# Container status
docker compose ps

# Resource usage
docker stats

# Database backup
docker compose exec postgres pg_dump -U weather weather_station > backup.sql
```

## 🐛 Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting guide.

## 🏗️ Technology Stack

- **Backend:** Node.js 20, Express 5, TypeScript
- **Frontend:** React 19, React Router 7, SSR
- **Database:** PostgreSQL 16
- **Build:** Vite, pnpm
- **Container:** Docker, Docker Compose
- **Platform:** Raspberry Pi 5 (ARM64)

---

**Happy Monitoring! 🌤️**