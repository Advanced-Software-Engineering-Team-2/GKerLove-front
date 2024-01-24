# GKerLove-front

果壳之恋前端项目

## 运行

安装依赖：

```shell
npm install
```

开发环境：

```shell
npm run dev
```

打包构建：

```shell
npm run build
```

## 配置后端服务器地址和聊天服务器地址

修改 *.env.development*中的*VITE_API_URL*为后端服务器地址，*VITE_CHAT_SERVER_URL*为聊天服务器地址。

## 项目结构

在*components*中编写组件，在*views*编写视图，在*stores*中编写业务逻辑，在*api*中编写与后端服务器交互的接口。

整个数据流：后端 <=> api <=> stores <=> views <=> components。
