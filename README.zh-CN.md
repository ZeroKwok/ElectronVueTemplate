# Vue-Electron 桌面应用模板

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[English](./README.md)

一个可用于生产环境的 Vue.js + Electron 应用模板，旨在帮助开发者快速构建跨平台桌面应用。

通过提供清晰的项目结构和预配置的开发环境，开发者可以专注于业务逻辑实现，而无需担心繁琐的基础设施搭建。

## ✨ 特性

- **现代化技术栈**  
  基于 Vue 3 和 Electron 生态，提供快速开发体验
- **无边框窗口**  
  提供可选圆角透明背景效果的窗口（Windows）
- **原生风格 UI**  
  可自定义的消息框组件，匹配原生系统对话框
- **主题系统**  
  内置亮/暗主题支持，易于自定义
- **国际化(i18n)**  
  从根目录动态加载语言文件，便于非开发者添加翻译
- **自动更新**  
  集成应用自动更新
- **一键打包**  
  基于 Electron Forge 的安装包构建流程

## 🚀 快速开始

```sh
# 克隆项目
git clone https://github.com/ZeroKwok/ElectronVueTemplate.git
cd ElectronVueTemplate

# 可选设置Node或Electron镜像
npm config set registry https://registry.npm.taobao.org
npm config set electron_mirror https://npmmirror.com/mirrors/electron/

# 安装依赖
npm install

# 运行
npm run start

# 打包
npm run package

# 构建安装程序
npm run make
```

## 🔨 项目结构

```sh
/
├── src/
│   ├── main/                # Electron主进程代码
│   │   ├── ipc.js           # 主进程/渲染进程通信
│   │   ├── main.js          # 主进程入口文件
│   │   ├── logger.js        # 主进程日志
│   │   ├── preload.js       # 预加载脚本
│   │   ├── ndialog.js       # 原生对话框
│   │   ├── updater.js       # 自动更新管理
│   │   └── ...
│   │
│   ├── renderer/            # Vue渲染进程代码
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # Vue组件
│   │   ├── router/          # Vue路由
│   │   ├── views/           # Vue页面视图
│   │   ├── locales/         # i18n 多语言文件(通常作为git子仓库)
│   │   ├── public           # 公共资源
│   │   ├── common           # 公共代码
│   │   │   ├── i18n.js      # i18n 多语言管理
│   │   │   ├── state.js     # 全局状态管理
│   │   │   ├── logger.js    # 渲染进程日志
│   │   │   ├── constants.js # 运行时环境常量
│   │   │   └── ...
│   │   │
│   │   ├── App.vue          # 根组件
│   │   └── renderer.js      # 渲染进程入口文件
│   │
│   ├── server/              # 服务器模式代码
│   │   ├── index.js         # 服务器模式入口文件
│   │   └── routes/          # 服务器模式路由
│   │
│   └── shared/              # 共享代码
│       ├── store/
│       │   ├── cache.js     # 运行时缓存管理(内存中)，主进程和渲染进程共享
│       │   └── settings.js  # 应用设置管理(磁盘存储)
│       │   └── preset.js    # 共享设置默认预设
│       └── utils/           # 共享工具函数
│           ├── env.js       # 运行时环境常量
│           └── example.js   # 示例工具函数
│
├── .env                     # 环境变量配置
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── index.html               # HTML入口点
├── package.json             # 项目依赖和脚本
├── forge.config.js          # Electron Forge配置
├── vite.*.config.mjs        # Vite配置(Electron Forge Vite插件)
└── README.md                # 项目文档
```

## 🤝 参与贡献

欢迎建议和代码贡献！提交PR前请确保阅读[贡献指南](CONTRIBUTING.md)。

## 许可证

本项目采用[MIT许可证](LICENSE)开源。
