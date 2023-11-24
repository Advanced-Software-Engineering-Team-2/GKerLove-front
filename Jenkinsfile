pipeline {
  agent {
    node {
      label 'nodejs17'
    }

  }
  stages {
    stage('拉取代码') {
      agent none
      steps {
        container('nodejs') {
          git(url: 'https://gitee.com/gyr679/gker-love-front.git', credentialsId: 'gitee', branch: 'master', changelog: true, poll: false)
          sh 'ls -lh'
        }

      }
    }

    stage('打包') {
      agent none
      steps {
        container('nodejs') {
          sh 'ls -lh'
          sh 'node -v'
          sh 'npm config set registry https://registry.npm.taobao.org'
          sh 'npm install'
          sh 'npm run build-only'
          sh 'ls -lh dist'
        }

      }
    }

    stage('构建镜像') {
      agent none
      steps {
        container('nodejs') {
          sh 'ls -lh'
          sh 'docker --version'
          sh 'docker build -t gkerlove-front:latest .'
        }

      }
    }

    stage('推送镜像') {
      agent none
      steps {
        container('nodejs') {
          withCredentials([usernamePassword(credentialsId : 'aliyun-docker-registry' ,passwordVariable : 'DOCKER_PASSWD' ,usernameVariable : 'DOCKER_USER' ,)]) {
            sh 'echo "$DOCKER_PASSWD" | docker login $REGISTRY -u "$DOCKER_USER" --password-stdin'
            sh 'docker tag gkerlove-front:latest $REGISTRY/$DOCKERHUB_NAMESPACE/gkerlove-front:SNAPSHOT-$BUILD_NUMBER'
            sh 'docker push $REGISTRY/$DOCKERHUB_NAMESPACE/gkerlove-front:SNAPSHOT-$BUILD_NUMBER'
          }

        }

      }
    }

    stage('部署到k8s') {
      agent none
      steps {
        container('nodejs') {
          withCredentials([kubeconfigFile(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
            sh 'envsubst < deploy/deploy.yaml | kubectl apply -f -'
          }

        }

      }
    }

    stage('部署成功邮件通知') {
      agent none
      steps {
        mail(to: '157679566@qq.com', subject: '部署结果', body: 'gkerlove-front构建成功！')
      }
    }

  }
  environment {
    REGISTRY = 'registry.cn-qingdao.aliyuncs.com'
    DOCKERHUB_NAMESPACE = 'gkerlove'
  }
}