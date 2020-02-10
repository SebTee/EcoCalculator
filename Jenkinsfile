pipeline {
    agent any

    stages {
        stage('Update Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm start'
            }
        }
    }
}