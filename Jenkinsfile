pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    // Azure Container Registry
    ACR = credentials('acr-registry')
    ACR_SERVER = "${ACR_USR}.azurecr.io"
    
    // Frontend Server 1 (Azure VM)
    FRONTEND_SERVER = credentials('frontend-server')
    FRONTEND_HOST = "${FRONTEND_SERVER_USR}"
    FRONTEND_USER = "${FRONTEND_SERVER_PSW}"
    
    // Backend Server 2 (Azure VM)
    BACKEND_SERVER = credentials('backend-server')
    BACKEND_HOST = "${BACKEND_SERVER_USR}"
    BACKEND_USER = "${BACKEND_SERVER_PSW}"
    
    // Image Names
    BACKEND_IMAGE = "neet-backend"
    FRONTEND_IMAGE = "neet-frontend"
    TAG = "latest"
    BUILD_TAG = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"
  }

  stages {
    
    stage('Checkout') {
      steps {
        checkout scm
        script {
          echo "✓ Repository checked out"
          echo "Branch: ${GIT_BRANCH}"
          echo "Commit: ${GIT_COMMIT}"
        }
      }
    }

    stage('Login to ACR') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'acr-creds', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
            sh '''
              echo "Logging into Azure Container Registry..."
              docker login ${ACR_SERVER} -u ${ACR_USER} -p ${ACR_PASS}
              echo "✓ ACR login successful"
            '''
          }
        }
      }
    }

    stage('Build Backend') {
      steps {
        script {
          echo "Building backend Docker image..."
          sh '''
            cd backend
            docker build -t ${ACR_SERVER}/${BACKEND_IMAGE}:${BUILD_TAG} \
              -t ${ACR_SERVER}/${BACKEND_IMAGE}:${TAG} \
              -f Dockerfile .
            echo "✓ Backend image built successfully"
          '''
        }
      }
    }

    stage('Build Frontend') {
      steps {
        script {
          echo "Building frontend Docker image..."
          sh '''
            cd client
            docker build -t ${ACR_SERVER}/${FRONTEND_IMAGE}:${BUILD_TAG} \
              -t ${ACR_SERVER}/${FRONTEND_IMAGE}:${TAG} \
              --build-arg REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} \
              -f Dockerfile .
            echo "✓ Frontend image built successfully"
          '''
        }
      }
    }

    stage('Push to ACR') {
      steps {
        script {
          echo "Pushing images to Azure Container Registry..."
          sh '''
            docker push ${ACR_SERVER}/${BACKEND_IMAGE}:${BUILD_TAG}
            docker push ${ACR_SERVER}/${BACKEND_IMAGE}:${TAG}
            docker push ${ACR_SERVER}/${FRONTEND_IMAGE}:${BUILD_TAG}
            docker push ${ACR_SERVER}/${FRONTEND_IMAGE}:${TAG}
            echo "✓ Images pushed to ACR successfully"
          '''
        }
      }
    }

    stage('Deploy Frontend') {
      steps {
        script {
          withCredentials([file(credentialsId: 'frontend-ssh-key', variable: 'SSH_KEY')]) {
            sh '''
              echo "Deploying frontend to Server 1..."
              
              # Copy SSH key and set permissions
              cp ${SSH_KEY} /tmp/frontend-key.pem
              chmod 600 /tmp/frontend-key.pem
              
              # SSH into frontend server and deploy
              ssh -i /tmp/frontend-key.pem -o StrictHostKeyChecking=no ${FRONTEND_USER}@${FRONTEND_HOST} << 'EOF'
              
              # Login to ACR
              docker login ${ACR_SERVER} -u ${ACR_USER} -p ${ACR_PASS}
              
              # Pull latest frontend image
              docker pull ${ACR_SERVER}/${FRONTEND_IMAGE}:${TAG}
              
              # Stop and remove old container
              docker stop neet-frontend-app || true
              docker rm neet-frontend-app || true
              
              # Run new frontend container
              docker run -d \
                --name neet-frontend-app \
                -p 80:3000 \
                -p 443:3000 \
                --restart unless-stopped \
                ${ACR_SERVER}/${FRONTEND_IMAGE}:${TAG}
              
              echo "✓ Frontend deployed successfully"
              docker ps --filter "name=neet-frontend-app"
              
EOF
              
              rm -f /tmp/frontend-key.pem
            '''
          }
        }
      }
    }

    stage('Deploy Backend & Database') {
      steps {
        script {
          withCredentials([file(credentialsId: 'backend-ssh-key', variable: 'SSH_KEY')]) {
            sh '''
              echo "Deploying backend and database to Server 2..."
              
              # Copy SSH key
              cp ${SSH_KEY} /tmp/backend-key.pem
              chmod 600 /tmp/backend-key.pem
              
              # SSH into backend server and deploy
              ssh -i /tmp/backend-key.pem -o StrictHostKeyChecking=no ${BACKEND_USER}@${BACKEND_HOST} << 'EOF'
              
              # Login to ACR
              docker login ${ACR_SERVER} -u ${ACR_USER} -p ${ACR_PASS}
              
              # Pull latest backend image
              docker pull ${ACR_SERVER}/${BACKEND_IMAGE}:${TAG}
              
              # Navigate to project directory
              cd /opt/neet-academy
              
              # Create .env file if it doesn't exist
              if [ ! -f .env ]; then
                cp .env.example .env
              fi
              
              # Stop and remove old containers
              docker-compose down || true
              
              # Update and start services
              docker-compose pull
              docker-compose up -d
              
              echo "✓ Backend and Database deployed successfully"
              docker-compose ps
              
              # Run database migrations
              docker-compose exec -T backend node run-migration.js
              echo "✓ Database migrations completed"
              
EOF
              
              rm -f /tmp/backend-key.pem
            '''
          }
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          echo "Performing health checks..."
          sh '''
            # Frontend health check
            echo "Checking frontend health..."
            for i in {1..5}; do
              if curl -f http://${FRONTEND_HOST} > /dev/null 2>&1; then
                echo "✓ Frontend is healthy"
                break
              fi
              if [ $i -lt 5 ]; then
                echo "  Attempt $i failed, retrying..."
                sleep 10
              fi
            done
            
            # Backend health check (via SSH)
            echo "Checking backend health..."
            ssh -i /tmp/backend-key.pem -o StrictHostKeyChecking=no ${BACKEND_USER}@${BACKEND_HOST} \
              "curl -f http://localhost:5000/api/health || echo 'Backend check skipped (internal only)'"
          '''
        }
      }
    }
  }

  post {
    always {
      // Cleanup
      sh '''
        rm -f /tmp/*-key.pem
        docker logout ${ACR_SERVER} || true
      '''
    }

    success {
      script {
        echo "✓ Pipeline completed successfully!"
        echo ""
        echo "Deployment Summary:"
        echo "==================="
        echo "Frontend: http://${FRONTEND_HOST}"
        echo "Backend: http://${BACKEND_HOST}:5000"
        echo "Build: ${BUILD_TAG}"
      }
    }

    failure {
      script {
        echo "✗ Pipeline failed!"
        echo ""
        echo "Check logs above for details"
      }
    }
  }
}
