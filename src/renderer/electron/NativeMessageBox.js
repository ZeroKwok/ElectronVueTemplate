import { createApp } from 'vue'
import store from '@/common/state'
import i18n from '@/i18n'
import App from './NativeMessageBox.vue'
import '@/index.css';

const app = createApp(App)
app.use(store)
app.use(i18n)
app.mount('#app')