Here is the deployment overview made more structured and clear with proper formatting:

***

## Deployment Overview

Run the appropriate Docker Compose file based on your deployment goal:  

- **Local production-style setup (separate client/server):**  
  ```bash
  docker compose -f docker-compose.yml up -d --build
  ```

- **Local development with hot reload (Vite + nodemon):**  
  ```bash
  docker compose -f docker-compose.dev.yml up -d
  ```

- **EC2 or single-image deployment (client baked into server, exposed on port 80):**  
  ```bash
  docker compose -f docker-compose.ec2.yml up -d --build
  ```

Run these commands from the repository root. Choose the file that matches your deployment environment.

***

## Docker Compose Configurations

This repository provides three Docker Compose configurations:

- `docker-compose.yml`: Production-like multi-container setup, client and server run separately (good for PaaS or serving frontend with nginx).
- `docker-compose.dev.yml`: Development setup with hot reload, mounts source directories and runs `npm run dev`.
- `docker-compose.ec2.yml`: Single-image build for EC2, with React client built into the Node.js server image, serving on port 80 behind one origin.

***

## EC2 Deployment Steps

1. **Prerequisites:**
   - EC2 instance (Ubuntu 22.04 or Amazon Linux 2) with at least 2 vCPU / 4 GB RAM.
   - Security group opening port 80 (and port 443 if terminating TLS locally).
   - Install Docker Engine 24+ and Docker Compose plugin using:
     ```bash
     sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
     curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
     echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     sudo apt-get update
     sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
     sudo usermod -aG docker $USER
     ```
     Log out and back in, or run `newgrp docker` to use Docker without sudo.

2. **Prepare environment files locally:**
   ```bash
   cp server/.env.example server/.env.production
   cp client/.env.example client/.env.production
   ```
   Example contents for `server/.env.production`:
   ```
   PORT=8000
   MONGODB_URI=mongodb://mongodb:27017/todo
   CLIENT_URL=https://todo.example.com
   SECRET_KEY=replace-with-strong-secret
   ```
   Example contents for `client/.env.production`:
   ```
   VITE_API_URL=https://todo.example.com
   ```
   Keep these files out of version control; upload securely to the EC2 server.

3. **Clone repo and move env files on EC2:**
   ```bash
   ssh ubuntu@your-ec2-host
   git clone https://github.com/<you>/TODO_monolithic_architecture.git
   cd TODO_monolithic_architecture
   mv ~/server.env.production server/.env.production
   mv ~/client.env.production client/.env.production
   ```

4. **Build and run containers:**
   ```bash
   docker compose -f docker-compose.ec2.yml up -d --build
   ```
   - The Express server listens on port 8000 internally, mapped to host port 80 by Compose.
   - MongoDB data persists via volume `mongodb_data`. Use an EBS-backed bind mount for snapshots if needed.

   Useful commands for monitoring:
   ```bash
   docker compose -f docker-compose.ec2.yml logs -f app
   docker compose -f docker-compose.ec2.yml ps
   docker compose -f docker-compose.ec2.yml pull && docker compose -f docker-compose.ec2.yml up -d
   ```

5. **Hardening Tips:**
   - Place instance behind an Application Load Balancer or nginx/Caddy proxy for HTTPS termination.
   - Use snapshots or managed MongoDB services (e.g., Atlas) for automatic backups.
   - Run Compose as a systemd service to restart containers on reboot.
   - Add monitoring (CloudWatch, Netdata) for resource usage alerts.

***

Following these structured steps lets you consistently deploy to EC2 using one Docker Compose command tailored for that environment. This setup supports seamless transition from local development to production deployment.

This structure and clarity are ideal for easy reference and execution in deployment workflows.  

If more advanced explanations or help with any step is needed, feel free to ask!

[1](https://docs.synthesized.io/tdk/latest/user_guide/100_deployment/dc)
[2](https://docs.docker.com/compose/how-tos/production/)
[3](https://www.reddit.com/r/docker/comments/13kxfjf/how_to_handle_dockercompose_for_production_and/)
[4](https://docs.docker.com/compose/gettingstarted/)
[5](https://docs.docker.com/guides/frameworks/laravel/production-setup/)
[6](https://github.com/compiiile/compiiile)
[7](https://stackoverflow.com/questions/52731245/how-to-use-docker-compose-yml-file-for-production)
[8](https://docs.axway.com/bundle/axway-open-docs/page/docs/operational_insights/production_setup/op_insights_setup_prod_docker/index.html)
[9](https://nickjanetakis.com/blog/best-practices-around-production-ready-web-apps-with-docker-compose)
[10](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/multi-container-applications-docker-compose)