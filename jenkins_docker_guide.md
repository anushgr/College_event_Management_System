# Jenkins + Docker CI/CD Pipeline — Demo Guide
### College Event Management System

---

## Files Created

| File | Purpose |
|------|---------|
| `Jenkinsfile` | Declarative pipeline for Windows Jenkins nodes |
| `Dockerfile.frontend` | Multi-stage: Node build + Nginx |
| `Dockerfile.backend` | Multi-stage: Gradle build + Java JRE |
| `nginx.conf` | Nginx routing/proxy config |
| `docker-compose.yml` | Full stack deployment |
| `docker-demo.bat` | One-click local Docker Demo |

---

## Part 1 — Key Demo Steps

1.  **Stop all local instances** of the backend (to free up memory, although we're using port 8081).
2.  **Jenkins Build**: Trigger "Build Now" and show the Pipeline stages are now **green**.
3.  **Docker Verify**: Run `docker images` to see the images were successfully built.
4.  **Docker Run**: Run `docker ps` to see the application is now running as two linked containers.

---

## Part 2 — Deployment Config

| Service | Host Port | Internal Port |
|---------|-----------|---------------|
| Frontend | 80 | 80 |
| Backend | **8081** | 8080 |

> [!TIP]
> Port **8081** is used for the backend to avoid conflicts with your local Jenkins server (on 8080).

---

## Part 3 — Access URLs

- **APP LOGIN**: [http://localhost](http://localhost)
- **BACKEND API**: [http://localhost:8081/api](http://localhost:8081/api)
