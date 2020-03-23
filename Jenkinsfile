pipeline {
    agent any

    stages {
        stage('Update Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                sh 'npm start'
            }
        }
    }
}