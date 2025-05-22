import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url'
import { resolve } from "node:path"
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import pkg from './package.json'

// https://vitejs.dev/config
const config = {
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src/renderer', import.meta.url)),
          '#': fileURLToPath(new URL('./src/shared', import.meta.url))
        },
    },
    build: {
        sourcemap: true,
        target: 'es2022', // 设置为支持 top-level await 的环境
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                messageBox: resolve('src/renderer/electron/NativeMessageBox.html'),
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern",
                additionalData: `@use "@/styles/element.scss" as *;`,
            }
        }
    },
    define: {
        '__APP_VERSION__': JSON.stringify(pkg.version),
        '__APP_NAME__': JSON.stringify(pkg.productName),
    },
};

if (process.env.NODE_ENV == 'development') {
    config.plugins.push(VueDevTools());
}

export default defineConfig(config);
