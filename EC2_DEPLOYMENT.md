## EC2 Deployment Runbook

This document captures the exact commands used to deploy `Todo_monolithic_architecture` to an Amazon Linux EC2 instance, plus the key concepts to remember (port mapping, env files, troubleshooting).

---

### 1. Prerequisites
- Amazon Linux 2 EC2 instance (2 vCPU / 4 GB RAM recommended).
- Security group with inbound TCP 80 (and 443 if adding TLS later).
- SSH access and GitHub reachability.

---

### 2. System Setup Commands (run once per new EC2 host)
```bash
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo yum install -y docker git
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER              # optional; re-login to use docker without sudo

sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -L https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-linux-x86_64 \
     -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

---

### 3. Application Setup Commands
```bash
cd ~
git clone https://github.com/Yogendrasinghrathod/Todo_monolithic_architecture.git
cd Todo_monolithic_architecture

cd server
cp .env .env.production                     # use existing .env as template
nano .env.production                        # edit values shown below
```

Production env contents:
```
PORT=8000
MONGODB_URI=mongodb://mongodb:27017/todo     # or Atlas URI
CLIENT_URL=http://98.93.214.155              # replace with your domain/IP
SECRET_KEY=<strong-random-string>
```

Return to repo root and launch:
```bash
cd ~/Todo_monolithic_architecture
sudo docker compose -f docker-compose.ec2.yml up -d --build
sudo docker compose -f docker-compose.ec2.yml ps
sudo docker logs todo-app -f                 # watch for “listening on port -> 8000”
```

To stop later:
```bash
sudo docker compose -f docker-compose.ec2.yml down
```

---

### 4. Client + Server Port Mapping (single origin)
- The multi-stage `Dockerfile` builds the React client (`client/dist`) and copies it into the server image.
- `server/app.js` serves those static assets when `NODE_ENV=production` and falls back with `app.get(/.*/, ...)`, so Express handles both API and UI.
- `docker-compose.ec2.yml` maps host port `80` → container port `8000`. Browsing to `http://<EC2-IP>/` hits the same Node process for UI and `/api/...` calls.

---

### 5. Things to Remember for Future Deploys
- **Keep secrets separate:** maintain `server/.env.production` outside version control; rotate `SECRET_KEY` per deploy.
- **Mongo hostname:** inside Compose, use `mongodb://mongodb:27017/todo` so the app reaches the Mongo service; switch to Atlas URI if using hosted DB.
- **Security groups:** ensure port 80 (and 443 if TLS) are open on the EC2 instance.
- **Updates:** pull latest code (`git pull`) then re-run `sudo docker compose -f docker-compose.ec2.yml up -d --build`.
- **Troubleshooting:** if site refuses connection, check `docker compose ps`, view `docker logs todo-app -f`, confirm security group/firewall, and verify the SPA catch-all route remains `app.get(/.*/, ...)`.
- **Backups:** Mongo data lives in the `mongodb_data` volume; snapshot the EBS volume or switch to a managed DB for persistence.

---

Following this checklist reproduces the working deployment you just verified at `http://98.93.214.155/`. Adjust IPs, domains, and secrets per environment.

