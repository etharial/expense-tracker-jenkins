pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install and Test') {
            steps {
                sh 'node --version'
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run coverage'
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withEnv(["PATH+SONAR=${scannerHome}/bin"]) {
                        withSonarQubeEnv('SonarQube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifact') {
            when {
                branch 'main'
            }
            steps {
                sh 'tar -czf release-bundle.tar.gz dist Dockerfile'
                archiveArtifacts artifacts: 'release-bundle.tar.gz', fingerprint: true
            }
        }
    }

}
