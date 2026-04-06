@echo off
echo ============================================================
echo   College Event Management System - Docker Demo
echo ============================================================

echo.
echo [STEP 1] Building Frontend Docker Image...
docker build -f Dockerfile.frontend -t event-management-frontend:latest .
if %errorlevel% neq 0 ( echo ERROR: Frontend build failed! & exit /b 1 )
echo [OK] Frontend image built.

echo.
echo [STEP 2] Building Backend Docker Image...
docker build -f Dockerfile.backend -t event-management-backend:latest .
if %errorlevel% neq 0 ( echo ERROR: Backend build failed! & exit /b 1 )
echo [OK] Backend image built.

echo.
echo [STEP 3] Verifying Docker Images...
echo -----------------------------------------
docker images | findstr event-management
echo -----------------------------------------

echo.
echo [STEP 4] Stopping any existing containers...
docker rm -f event-frontend event-backend 2>nul
echo [OK] Done.

echo.
echo [STEP 5] Starting Backend Container...
docker run -d --name event-backend -p 8081:8080 event-management-backend:latest
echo [OK] Backend running on port 8081.

echo.
echo [STEP 6] Starting Frontend Container...
docker run -d --name event-frontend -p 80:80 --link event-backend:backend event-management-frontend:latest
echo [OK] Frontend running on port 80.

echo.
echo [STEP 7] Running Containers:
echo -----------------------------------------
docker ps --filter "name=event-"
echo -----------------------------------------

echo.
echo ============================================================
echo   Application is LIVE!
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8081
echo ============================================================
pause
