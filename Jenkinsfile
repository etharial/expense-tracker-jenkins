pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
        copyArtifactPermission('Pocket-Ledger-CD')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                echo "Branch: ${env.BRANCH_NAME}"
                echo "CI build number: ${env.BUILD_NUMBER}"
            }
        }

        stage('Install and Test') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Coverage') {
            steps {
                sh 'npm run coverage'
                sh 'test -s coverage/lcov.info'
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
                sh 'test -s dist/index.html'
            }
        }

        stage('Archive Artifact') {
            when {
                branch 'main'
            }

            steps {
                sh '''
                    set -eu

                    artifact="expense-tracker-${BUILD_NUMBER}.tar.gz"

                    test -f Dockerfile
                    test -s dist/index.html

                    tar -czf "$artifact" dist Dockerfile

                    test -s "$artifact"

                    echo "Created CI artifact: $artifact"
                    tar -tzf "$artifact"
                '''

                archiveArtifacts(
                    artifacts: "expense-tracker-${env.BUILD_NUMBER}.tar.gz",
                    fingerprint: true,
                    onlyIfSuccessful: true
                )
            }
        }
    }

    post {
        success {
            echo "CI passed for ${env.BRANCH_NAME}, build ${env.BUILD_NUMBER}."
        }

        failure {
            echo "CI failed. Review the failed stage in Console Output."
        }

        aborted {
            echo "CI build aborted."
        }
    }
}
