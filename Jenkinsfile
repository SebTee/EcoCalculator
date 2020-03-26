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
                sh 'npm test',
                sh 'psql -d ecocalculator -f ./database/deleteDB.sql',
                sh 'psql -d ecocalculator -f ./database/createDB.sql'
            }
        }
        stage('Build') {
            steps {
                sh 'npm start'
            }
        }
    }
}