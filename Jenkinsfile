pipeline {
    agent any

    // ─── Environment Variables ───────────────────────────────────────────────
    environment {
        // Change these to match your Docker Hub / registry username
        DOCKER_HUB_USER    = 'your-dockerhub-username'
        FRONTEND_IMAGE     = "${DOCKER_HUB_USER}/event-management-frontend"
        BACKEND_IMAGE      = "${DOCKER_HUB_USER}/event-management-backend"
        IMAGE_TAG          = "${BUILD_NUMBER}"                // e.g. "42"
        DOCKER_CREDENTIALS = 'dockerhub-credentials'         // Jenkins credential ID
    }

    // ─── Build Options ───────────────────────────────────────────────────────
    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // ─── Stages ──────────────────────────────────────────────────────────────
    stages {

        // ── Stage 1: Checkout ────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '======== Checking out source code ========'
                checkout scm
                bat 'git branch --show-current'
                bat 'git rev-parse --short HEAD'
            }
        }



        // ── Stage 4: Docker Build ────────────────────────────────────────────
        stage('Docker Build') {
            steps {
                echo '======== Building Docker Images ========'
                bat """
                    @echo off
                    echo Building frontend Docker image...
                    docker build -f Dockerfile.frontend ^
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ^
                        -t ${FRONTEND_IMAGE}:latest ^
                        .

                    echo Building backend Docker image...
                    docker build -f Dockerfile.backend ^
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} ^
                        -t ${BACKEND_IMAGE}:latest ^
                        .

                    echo ======== Docker Images Created ========
                    docker images | findstr "event-management"
                """
            }
        }

        // ── Stage 5: Docker Push (Optional – requires Docker Hub creds) ──────
        stage('Docker Push') {
            when {
                // Only push when building from main branch
                branch 'main'
            }
            steps {
                echo '======== Pushing images to Docker Hub ========'
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                        @echo off
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                        
                        echo "✅ Images pushed to Docker Hub"
                        docker logout
                    """
                }
            }
        }

        // ── Stage 6: Deploy (Run Containers) ────────────────────────────────
        stage('Deploy') {
            steps {
                echo '======== Starting Application Containers ========'
                bat """
                    @echo off
                    REM Stop and remove any existing containers
                    docker rm -f event-frontend event-backend >nul 2>&1

                    REM Run backend container
                    echo Starting Backend: ${BACKEND_IMAGE}:latest
                    docker run -d ^
                        --name event-backend ^
                        -p 8081:8080 ^
                        --restart unless-stopped ^
                        ${BACKEND_IMAGE}:latest

                    REM Run frontend container
                    echo Starting Frontend: ${FRONTEND_IMAGE}:latest
                    docker run -d ^
                        --name event-frontend ^
                        -p 80:80 ^
                        --link event-backend:backend ^
                        --restart unless-stopped ^
                        ${FRONTEND_IMAGE}:latest

                    echo ======== Running Containers ========
                    docker ps --filter "name=event-"

                    echo ✅ Application deployed!
                    echo Frontend: http://localhost:80
                    echo Backend:  http://localhost:8081
                """
            }
        }

        // ── Stage 7: Verify ─────────────────────────────────────────────────
        stage('Verify') {
            steps {
                echo '======== Verifying Deployment ========'
                bat '''
                    @echo off
                    timeout /t 10 /nobreak >nul
                    
                    echo --- All Docker Images ---
                    docker images

                    echo.
                    echo --- Running Containers ---
                    docker ps

                    echo.
                    echo --- Container Logs (backend) ---
                    docker logs event-backend --tail 20

                    echo.
                    echo "✅ Verification complete"
                '''
            }
        }
    }

    // ─── Post Actions ────────────────────────────────────────────────────────
    post {
        success {
            echo """
            ╔══════════════════════════════════════╗
            ║   ✅  BUILD SUCCESSFUL  ✅            ║
            ║  Build #${BUILD_NUMBER} completed    ║
            ╚══════════════════════════════════════╝
            Frontend: http://localhost:80
            Backend:  http://localhost:8080/api
            """
        }
        failure {
            echo """
            ╔══════════════════════════════════════╗
            ║   ❌  BUILD FAILED  ❌                ║
            ║  Check logs for Build #${BUILD_NUMBER}║
            ╚══════════════════════════════════════╝
            """
            // Clean up failed containers
            bat 'docker rm -f event-frontend event-backend >nul 2>&1'
        }
        always {
            echo 'Pipeline execution complete.'
        }
    }
}
