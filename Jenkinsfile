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
                sh 'echo "Branch: $(git branch --show-current)"'
                sh 'echo "Commit: $(git rev-parse --short HEAD)"'
            }
        }

        // ── Stage 2: Build Frontend ──────────────────────────────────────────
        stage('Build Frontend') {
            steps {
                echo '======== Installing & building React app ========'
                sh '''
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    echo "✅ Frontend build complete"
                    ls -la dist/
                '''
            }
        }

        // ── Stage 3: Build Backend ───────────────────────────────────────────
        stage('Build Backend') {
            steps {
                echo '======== Building Spring Boot JAR ========'
                dir('backend') {
                    sh '''
                        chmod +x gradlew
                        ./gradlew bootJar --no-daemon -x test
                        echo "✅ Backend JAR created"
                        ls -la build/libs/
                    '''
                }
            }
        }

        // ── Stage 4: Docker Build ────────────────────────────────────────────
        stage('Docker Build') {
            steps {
                echo '======== Building Docker Images ========'
                sh '''
                    # Build frontend image
                    echo "Building frontend Docker image..."
                    docker build -f Dockerfile.frontend \
                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                        -t ${FRONTEND_IMAGE}:latest \
                        .

                    # Build backend image
                    echo "Building backend Docker image..."
                    docker build -f Dockerfile.backend \
                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                        -t ${BACKEND_IMAGE}:latest \
                        .

                    echo "======== Docker Images Created ========"
                    docker images | grep "event-management"
                '''
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
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest

                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest

                        echo "✅ Images pushed to Docker Hub"
                        docker logout
                    '''
                }
            }
        }

        // ── Stage 6: Deploy (Run Containers) ────────────────────────────────
        stage('Deploy') {
            steps {
                echo '======== Starting Application Containers ========'
                sh '''
                    # Stop and remove any existing containers
                    docker rm -f event-frontend event-backend 2>/dev/null || true

                    # Run backend container
                    docker run -d \
                        --name event-backend \
                        -p 8080:8080 \
                        --restart unless-stopped \
                        ${BACKEND_IMAGE}:latest

                    # Run frontend container
                    docker run -d \
                        --name event-frontend \
                        -p 80:80 \
                        --link event-backend:backend \
                        --restart unless-stopped \
                        ${FRONTEND_IMAGE}:latest

                    echo "======== Running Containers ========"
                    docker ps --filter "name=event-"

                    echo "✅ Application deployed!"
                    echo "Frontend: http://localhost:80"
                    echo "Backend:  http://localhost:8080"
                '''
            }
        }

        // ── Stage 7: Verify ─────────────────────────────────────────────────
        stage('Verify') {
            steps {
                echo '======== Verifying Deployment ========'
                sh '''
                    sleep 10
                    echo "--- All Docker Images ---"
                    docker images

                    echo ""
                    echo "--- Running Containers ---"
                    docker ps

                    echo ""
                    echo "--- Container Logs (backend) ---"
                    docker logs event-backend --tail 20 || true

                    echo ""
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
            sh 'docker rm -f event-frontend event-backend 2>/dev/null || true'
        }
        always {
            echo 'Pipeline execution complete.'
        }
    }
}
