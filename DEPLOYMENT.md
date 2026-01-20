# Weather Station - Docker Deployment Guide

Complete guide for deploying the Weather Station application on a Raspberry Pi 5 (4GB) using Docker.

## Prerequisites

### Hardware Requirements
- **Raspberry Pi 5** (4GB RAM minimum)
- MicroSD card (32GB+ recommended)
- Stable internet connection
- Power supply (official Raspberry Pi 5 power supply recommended)

### Software Requirements
- **Raspberry Pi OS** (64-bit, Bookworm or newer)
- **Docker** and **Docker Compose**

## Installation Steps

### 1. Prepare Raspberry Pi

Update your system:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker

Install Docker on Raspberry Pi:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Enable Docker to start on boot
sudo systemctl enable docker

# Reboot to apply group changes
sudo reboot
```

After reboot, verify Docker installation:
```bash
docker --version
docker compose version
```

### 3. Clone/Copy Project Files

Transfer the project to your Raspberry Pi:
```bash
# Option 1: Clone from Git (if available)
git clone <your-repo-url> weather-station
cd weather-station

# Option 2: Copy files via SCP
# From your local machine:
scp -r /path/to/weather-station pi@<raspberry-pi-ip>:~/
```

### 4. Configure Environment Variables

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:
```bash
nano .env
```

**Important:** Change the default password for production!
```env
POSTGRES_PASSWORD=your_secure_password_here
```

### 5. Build and Start Services

Build the Docker images (this will take several minutes on first run):
```bash
docker compose build
```

Start the services:
```bash
docker compose up -d
```

### 6. Verify Deployment

Check that all containers are running:
```bash
docker compose ps
```

You should see:
- `weather-station-db` (postgres) - healthy
- `weather-station-app` (app) - up

View logs:
```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs app
docker compose logs postgres
```

### 7. Access the Application

Open your browser and navigate to:
- **Local:** http://localhost:3000
- **Network:** http://<raspberry-pi-ip>:3000

## Management Commands

### Stop Services
```bash
docker compose stop
```

### Start Services
```bash
docker compose start
```

### Restart Services
```bash
docker compose restart
```

### Stop and Remove Containers
```bash
docker compose down
```

### Stop and Remove Containers + Volumes (⚠️ This deletes all data!)
```bash
docker compose down -v
```

### View Container Status
```bash
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
```

### Execute Commands in Container
```bash
# Access app container shell
docker compose exec app sh

# Access postgres container
docker compose exec postgres psql -U weather -d weather_station
```

## Database Management

### Backup Database
```bash
docker compose exec postgres pg_dump -U weather weather_station > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
docker compose exec -T postgres psql -U weather weather_station < backup.sql
```

### View Database Tables
```bash
docker compose exec postgres psql -U weather -d weather_station -c "\dt"
```

## Updating the Application

### Update Code and Rebuild
```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs for errors
docker compose logs

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Database Connection Issues
```bash
# Check if postgres is healthy
docker compose ps

# Check postgres logs
docker compose logs postgres

# Verify database credentials in .env file
cat .env
```

### Out of Memory Issues (Raspberry Pi)
```bash
# Check memory usage
free -h

# Restart services to free memory
docker compose restart
```

### Port Already in Use
```bash
# Change ports in .env file
nano .env

# Modify APP_PORT or POSTGRES_PORT
APP_PORT=8080
POSTGRES_PORT=5433

# Restart
docker compose down
docker compose up -d
```

## Performance Optimization for Raspberry Pi

### 1. Limit Container Memory
Edit `docker-compose.yml` to add memory limits:
```yaml
services:
  app:
    # ... existing config ...
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### 2. Enable Swap (if needed)
```bash
# Check current swap
free -h

# Add swap file (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Monitor Resources
```bash
# Install htop
sudo apt install htop

# Monitor in real-time
htop

# Docker stats
docker stats
```

## Security Best Practices

### 1. Change Default Passwords
Always change the default database password in `.env`

### 2. Firewall Configuration
```bash
# Install ufw
sudo apt install ufw

# Allow SSH (important!)
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow app port
sudo ufw allow 3000

# Enable firewall
sudo ufw enable
```

### 3. Keep System Updated
```bash
# Regular updates
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

## Automatic Startup on Boot

Docker Compose services with `restart: unless-stopped` will automatically start on system boot.

Verify:
```bash
docker compose ps
```

## Monitoring and Logs

### Enable Log Rotation
Create `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
docker compose up -d
```

## Support and Issues

### Common Errors

**Error: "Cannot connect to Docker daemon"**
```bash
sudo systemctl start docker
```

**Error: "port is already allocated"**
```bash
# Stop conflicting service or change port in .env
sudo lsof -i :3000
```

**Error: "permission denied"**
```bash
# Ensure user is in docker group
sudo usermod -aG docker $USER
# Log out and back in
```

## Architecture

### Services
- **postgres**: PostgreSQL 16 Alpine (ARM64 compatible)
- **app**: Node.js 20 Alpine with Weather Station application

### Volumes
- `postgres_data`: Persistent database storage
- `app_logs`: Application logs

### Network
- `weather-network`: Bridge network for inter-container communication

### Ports
- `3000`: Web application (configurable via APP_PORT)
- `5432`: PostgreSQL (configurable via POSTGRES_PORT)

## API Usage

Once deployed, devices can submit data using:

```bash
# Example: Submit weather data
curl -X POST http://<raspberry-pi-ip>:3000/api/device/data/submit \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "your-device-token",
    "deviceId": "your-device-id",
    "data": {
      "temperature": 22.5,
      "humidity": 65,
      "timestamp": "2024-01-19T12:00:00Z"
    }
  }'
```

## Maintenance Schedule

**Daily:**
- Monitor logs for errors: `docker compose logs --tail=100`

**Weekly:**
- Check disk space: `df -h`
- Review container stats: `docker stats`

**Monthly:**
- Backup database
- Update system packages: `sudo apt update && sudo apt upgrade`
- Update Docker images: `docker compose pull && docker compose up -d`

---

**Need Help?** Check the logs first: `docker compose logs -f`
