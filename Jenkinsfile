pipeline {
    agent any

    environment {
        NODE_VERSION = '16'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/joaovitor644/TicTacToe.git'
            }
        }

        stage('Setup Node') {
            steps {
                sh '''
                  # verificar versão Node
                  node --version || (echo "Node não instalado no agente"; exit 1)
                  npm --version || (echo "npm não instalado"; exit 1)
                '''
            }
        }

        stage('Install Node Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint / Static Code Check') {
            steps {
                sh '''
                  if [ -f package.json ] && grep -q \"eslint\" package.json; then
                    npm run lint
                  else
                    echo "ESLint não configurado — pulando lint"
                  fi
                '''
            }
        }

        stage('Test Node') {
            steps {
                sh '''
                  if [ -f package.json ] && grep -q "\"test\":" package.json; then
                    npm test
                  else
                    echo "Nenhum script de teste — pulando testes"
                  fi
                '''
            }
        }

        

        stage('Build (Static / front-end)') {
            steps {
                sh '''
                  # se tiver build configurado
                  if [ -f package.json ] && grep -q "\"build\":" package.json; then
                    npm run build
                  else
                    echo "Nenhum build script definido — pulando"
                  fi
                '''
            }
        }

        stage('Deploy Simulado / Smoke Test') {
            steps {
                // deploy local ou start server temporário
                sh 'nohup npm run start &> server.log &'
                sleep 10  // espera um pouco para ver se sobe
                echo "Servidor iniciado para smoke test"
            }
        }
    }

    post {
        success {
            echo "Pipeline executado com sucesso!"
        }
        failure {
            echo "Houve falha no pipeline!"
        }
        always {
            archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
            // opcional: coletar logs adicionais
        }
    }
}
