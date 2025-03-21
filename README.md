# README

This project is a Vue.js and Electron application template designed to help developers quickly build cross-platform desktop applications. By providing a clear project structure and pre-configured development environment, developers can focus on implementing business logic without worrying about tedious infrastructure setup.

---

本项目是基于 Vue.js 和 Electron 的应用程序模板，旨在帮助开发者快速构建跨平台桌面应用程序。通过提供清晰的项目结构和预配置的开发环境，开发者可以专注于业务逻辑的实现，而无需关心繁琐的基础设施。

## Features

- **Modern Tech Stack**: Based on Vue 3 and Vite, providing rapid development experience.
- **Modular Structure**: Clear project organization for easy expansion and maintenance.
- **Internationalization**: Built-in i18n support for multi-language application development.
- **Quick Packaging**: One-click packaging and installer building through Electron Forge.

## Usage

```sh
# Clone the project
git clone https://github.com/ZeroKwok/ElectronVueTemplate.git
cd ElectronVueTemplate

# Install dependencies
npm install

# Run
npm run start

# Package
npm run package

# Build installer
npm run make
```

## Project Structure

```sh
/
├── src/
│   ├── main/                # Electron main process code
│   │   ├── ipc.js           # Main/renderer process communication
│   │   ├── main.js          # Main process entry file
│   │   ├── preload.js       # Preload script
│   │   └── ...
│   │
│   ├── renderer/            # Vue renderer process code
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Vue components
│   │   ├── router/          # Vue router
│   │   ├── views/           # Vue page views
│   │   ├── locales/         # i18n translation file (usually also a git subrepository)
│   │   ├── public           # Public assets
│   │   ├── App.vue          # Root component
│   │   └── main.js          # Renderer process entry file
│   │
│   ├── server/              # Server mode code
│   │   ├── index.js         # Server mode entry file
│   │   └── routes/          # Server mode routes
│   │
│   └── shared/              # Shared code
│       ├── store/           # Settings/cache/state management
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

## Contributing

Suggestions and code contributions are welcome! Please make sure to read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

## License

This project is open-sourced under the [MIT License](LICENSE).
