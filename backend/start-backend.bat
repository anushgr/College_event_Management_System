@echo off
echo ============================================
echo  College Event Management - Spring Boot Backend
echo  Connected to: Neon PostgreSQL (Cloud)
echo ============================================
echo.

set JAVA_HOME=C:\Users\mpabh\.jdks\openjdk-24.0.2+12-54
set GRADLE=C:\Users\mpabh\.gradle\wrapper\dists\gradle-8.14-all\c2qonpi39x1mddn7hk5gh9iqj\gradle-8.14\bin\gradle.bat

echo [INFO] Starting Spring Boot backend on port 8080...
echo [INFO] API available at: http://localhost:8080/api
echo [INFO] Database: Neon PostgreSQL (Cloud)
echo.

"%GRADLE%" bootRun

pause
