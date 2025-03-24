import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        vue()
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
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern"
            }
        }
    }
});
