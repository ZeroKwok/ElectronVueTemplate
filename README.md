# Vue-Electron Desktop App Template

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[简体中文](./README.zh-CN.md)

A production-ready Vue.js + Electron application template designed to help developers quickly build cross-platform desktop applications.

By providing a clear project structure and pre-configured development environment, developers can focus on implementing business logic without worrying about tedious infrastructure setup.

## ✨ Features

- **Modern Tech Stack**  
  Powered by Vue 3 and Electron for optimal developer experience
- **Frameless Window**  
  Provides optional transparent background Windows with rounded corners for Windows
- **Native-like UI**  
  Customizable MessageBox components that match native OS dialogs
- **Theme System**  
  Built-in light/dark theme support with easy customization
- **Internationalization (i18n)**  
  Dynamic language file loading from root directory makes adding translations effortless
- **Auto Updater**  
  Seamless application updates with integrated version checking
- **One-click Packaging**  
  Streamlined build process using Electron Forge for installers

## 🚀 Getting Started

```sh
# Clone the project
git clone https://github.com/ZeroKwok/ElectronVueTemplate.git
cd ElectronVueTemplate

# Optionally, set the Node or Electron mirror URL
npm config set registry https://registry.npmmirror.com
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/

# Install dependencies
yarn

# Run
yarn start

# Package
yarn package

# Build installer
yarn make
```

### Ubuntu 24.04 and Later

In Ubuntu 24.04, there may be a sandbox restriction error at `yarn start`. Use the following command to remove the sandbox restriction.

```sh
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

## 🔨 Project Structure

```sh
/
├── src/
│   ├── main/                # Electron main process code
│   │   ├── ipc.js           # Main/renderer process communication
│   │   ├── main.js          # Main process entry file
│   │   ├── logger.js        # Main process logger
│   │   ├── preload.js       # Preload script
│   │   ├── ndialog.js       # Native dialog
│   │   ├── updater.js       # Auto update manager
│   │   └── ...
│   │
│   ├── renderer/            # Vue renderer process code
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Vue components
│   │   ├── router/          # Vue router
│   │   ├── views/           # Vue page views
│   │   ├── locales/         # i18n translation file (usually also a git subrepository)
│   │   ├── public           # Public assets
│   │   ├── common           # Common code
│   │   │   ├── i18n.js      # i18n management
│   │   │   ├── state.js     # Global state management
│   │   │   ├── logger.js    # Renderer process logger
│   │   │   ├── constants.js # Runtime environment constants
│   │   │   └── ...
│   │   │
│   │   ├── App.vue          # Root component
│   │   └── renderer.js      # Renderer process entry file
│   │
│   ├── server/              # Server mode code
│   │   ├── index.js         # Server mode entry file
│   │   └── routes/          # Server mode routes
│   │
│   └── shared/              # Shared code
│       ├── store/           # 
│       │   ├── cache.js     # Runtime cache management(in-memory), shared between the main and renderer process
│       │   └── settings.js  # App settings management(in-disk)
│       │   └── preset.js    # shared and settings default preset
│       └── utils/           # Shared utility functions
│           ├── env.js       # Runtime environment constants
│           └── example.js   # Example utility functions
│
├── .env                     # Environment variables config
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── index.html               # HTML entry point
├── package.json             # Project dependencies and scripts
├── forge.config.js          # Electron Forge configuration
├── vite.*.config.mjs        # Vite config (Electron Forge Vite Plugin)
└── README.md                # Project documentation
```

## 🤝 Contributing

Suggestions and code contributions are welcome! Please make sure to read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
