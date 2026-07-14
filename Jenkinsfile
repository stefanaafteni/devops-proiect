pipeline {
    agent any
    
    environment {
        REGISTRY = "stefanaafteni/simple-todo-app"
        DOCKER_CREDS = credentials('docker-hub-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Test Docker Image') {
            steps {
                dir('app') {
                    sh "docker build -t ${REGISTRY}:${BUILD_NUMBER} ."
                    sh "docker tag ${REGISTRY}:${BUILD_NUMBER} ${REGISTRY}:latest"
                }
            }
        }
        
        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "echo \$PASS | docker login -u \$USER --password-stdin"
                    sh "docker push ${REGISTRY}:${BUILD_NUMBER}"
                    sh "docker push ${REGISTRY}:latest"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply --insecure-skip-tls-verify=true -f k8s/postgres.yaml"
                sh "sed -i 's|<DOCKER_HUB_USERNAME>/simple-todo-app:latest|stefanaafteni/simple-todo-app:${BUILD_NUMBER}|g' k8s/deployment.yaml"
                sh "kubectl apply --insecure-skip-tls-verify=true -f k8s/deployment.yaml"
                sh "kubectl apply --insecure-skip-tls-verify=true -f k8s/service.yaml"
                sh "kubectl apply --insecure-skip-tls-verify=true -f k8s/ingress.yaml"
            }
        }
    }
    
    post {
        failure {
            echo 'Eroare detectata in timpul pipeline-ului.'
        }
        success {
            echo 'Pipeline finalizat cu succes! Aplicatia este stabila.'
        }
    }
}
