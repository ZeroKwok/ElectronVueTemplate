import { createApp, h, ref } from 'vue'
import MessageBox from './MessageBox.vue'

const createMessageBox = (options) => {
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)

    return new Promise((resolve, reject) => {
        const app = createApp({
            setup() {
                return () => h(MessageBox, {
                    modelValue: true,
                    title: options?.title || 'Info',
                    text: options.message,
                    type: options?.type || 'info',
                    buttons: options?.buttons || { confirm: 'Ok', cancel: 'Cancel' },
                    'onUpdate:modelValue': (val) => {
                        if (!val) {
                            visible.value = false
                        }
                    },
                    onClick: (btn) => {
                        resolve(btn.key)
                    },
                    onClosed: () => {
                        setTimeout(() => {
                            app.unmount()
                            document.body.removeChild(mountNode)
                        }, 300)
                    }
                })
            }
        })

        app.mount(mountNode)
    })
}

// 添加快捷方法
const types = ['success', 'warning', 'error', 'info', 'question']
types.forEach(type => {
    MessageBox[type] = (options) => {
        if (typeof options === 'string') {
            return createMessageBox({
                message: options,
                type
            })
        }
        return createMessageBox({
            ...options,
            type
        })
    }
})

MessageBox.confirm = MessageBox.info;
MessageBox.alert = MessageBox.warning;

export default MessageBox