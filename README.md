# README

## 使用

```sh
# 安装依赖
npm install

# 运行
npm run start

# 打包
npm run package

# 构建安装包
npm run make
```

## 项目结构

```sh
/
├── src/
│   ├── main/                  # Electron 主进程代码
│   │   ├── mian.js            # 主进程入口文件
│   │   ├── preload.js         # 预加载脚本
│   │   └── ...
│   │
│   ├── renderer/              # Vue 渲染进程代码
│   │   ├── assets/            # 静态资源
│   │   ├── components/        # Vue 组件
│   │   ├── router/            # Vue 路由
│   │   ├── store/             # Vuex 状态管理
│   │   ├── views/             # Vue 页面视图
│   │   ├── public             # 公共资源
│   │   ├── App.vue            # 根组件
│   │   └── main.js            # 渲染进程入口文件
│   │
│   ├── server/                # 服务模式代码
│   │   ├── index.js           # 服务模式入口文件
│   │   └── routes/            # 服务模式路由
│   │
│   └── shared/                # 共享代码
│       └── utils/             # 共享工具函数
│           └── example.js     # 示例工具函数
├── .env                       # 环境变量配置文件
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── index.html                 # HTML 模板
├── package.json               # 项目依赖和脚本
├── vite.xxxxxxx.config.mjs    # Vite 配置 (Electron Forge Vite Plugin)
└── README.md                  # 项目说明文档
```
