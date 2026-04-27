# College Event Management System — Full Stack
### Integrated with Docker, Jenkins & Kubernetes

A modern, full-stack application for managing community events. This project features a **React 18** frontend, a **Spring Boot** REST API backend, and a complete **CI/CD Pipeline** using Jenkins and Kubernetes.

---

## 🚀 Key Features

- ✅ **Full-Stack Orchestration**: Backend and Frontend connected via Docker.
- ✅ **CI/CD Pipeline**: Automated Build, Push, and Deploy stages in Jenkins.
- ✅ **Kubernetes Ready**: Complete manifest files for deployment on Minikube.
- ✅ **JWT Authentication**: Secure login with role-based access (USER / ORGANIZER).
- ✅ **Premium UI**: Glassmorphism dashboard with responsive design and Lucide icons.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Vite, Axios, Lucide React |
| **Backend** | Spring Boot (Java 17), Gradle, JWT, REST API |
| **Database** | Neon PostgreSQL (Cloud Hosting) |
| **DevOps** | Docker, Docker Compose, Jenkins, Kubernetes (Minikube) |

---

## 📂 Project Structure

```text
.
├── backend/                # Spring Boot REST API
├── src/                    # React Frontend Source
├── k8s/                    # Kubernetes Manifests (Namespace, Deployments, Services)
├── Dockerfile.backend      # Multi-stage Java build
├── Dockerfile.frontend     # Multi-stage Node/Nginx build
├── Jenkinsfile             # 8-Stage CI/CD Pipeline
├── docker-compose.yml      # Local full-stack orchestration
└── nginx.conf              # Nginx proxy configuration
```

---

## ⚙️ Deployment Options

### 1. Local Development
```bash
# Start Backend
cd backend && ./gradlew bootRun

# Start Frontend
npm install
npm run dev
```

### 2. Docker Compose (One-Click Local Deployment)
```bash
docker-compose up -d --build
```
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081/api

### 3. Jenkins CI/CD Pipeline
The `Jenkinsfile` automates the following stages:
1. **Checkout** -> 2. **Build** -> 3. **Push to Docker Hub** -> 4. **Local Deploy** -> 5. **Deploy to Kubernetes**

### 4. Kubernetes (Minikube)
```bash
# Load images into Minikube
minikube image load abhimp1234/event-management-frontend:latest
minikube image load abhimp1234/event-management-backend:latest

# Apply manifests
kubectl apply -f k8s/
```

---

## 🔐 Configuration
The application requires a `.env` file in the root directory with the following variables:
- `SPRING_DATASOURCE_URL`: Cloud DB URL
- `SPRING_DATASOURCE_USERNAME`: DB Username
- `SPRING_DATASOURCE_PASSWORD`: DB Password
- `JWT_SECRET`: Secret key for token signing

---

## 📜 License
This project is licensed under the ISC License.
