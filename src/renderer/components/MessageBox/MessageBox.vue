<template>
  <Dialog 
    :model-value="modelValue" 
    :title="title" 
    :draggable="true" 
    :modal="true"
    @update:modelValue="emit('update:modelValue', $event)" 
    @closed="btnClick({key: 'close'}); emit('closed')"
  >
    <template #icon>
      <div class="icon">
        <component :is="iconComponent"/>
      </div>
    </template>

    <div class="dialog-content">
      <slot name="body" :text="text" :type="type">
        <div class="body">
          <div class="body-icon" v-if="iconComponent">
            <component :is="iconComponent" :style="{ color: iconColor }" />
          </div>

          <div class="text">
            {{ text }}
          </div>
        </div>
      </slot>

      <slot name="footer" :buttons="getButtons()" :click="btn=>btnClick(btn)">
        <div class="footer">
          <slot name="footer-prefix">
          </slot>
          <el-button class="button" v-for="(btn, index) in getButtons()" :key="index" :type="btn.type || ''"
            :plain="btn.plain || false" :round="btn.round || false" @click="btnClick(btn)">
            {{ btn.text }}
          </el-button>
        </div>
      </slot>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import Dialog from '../Dialog.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Title',
  },
  text: {
    type: String,
    default: 'This is a message',
  },
  type: {
    type: String,
    default: 'info',
  },
  buttons: {
    type: Object,
    default: {
      no: 'No',
      yes: 'Yes',
    }
  }
});

const emit = defineEmits(['update:modelValue', 'closed', 'click']);

let isClicked = false;
const btnClick = (btn) => {
  if (isClicked) return;
  isClicked = true;
  emit('click', btn)
  emit('update:modelValue', false);
};

import {
    CircleCheckFilled,
    CircleCloseFilled,
    WarningFilled,
    InfoFilled,
    QuestionFilled
} from '@element-plus/icons-vue'

const colorMap = {
    success: '#67c23a',
    warning: '#e6a23c',
    info: '#909399',
    error: '#f56c6c',
    question: '#409eff'
}

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success': return CircleCheckFilled;
    case 'warning': return WarningFilled;
    case 'error': return CircleCloseFilled;
    case 'info': return InfoFilled;
    case 'question': return QuestionFilled;
    default: return null;
  }
});
const iconColor = computed(() => colorMap[props.type] || '#909399');

const getButtons = () => {
  const defaults = {
    type: '',
    plain: false
  };
  const primaryBtns = ['yes', 'ok', 'confirm'];
  const btns = [];
  for (const [key, value] of Object.entries(props.buttons)) {
    if (typeof value === 'string') {
      btns.push({
        ...defaults,
        key: key,
        text: value,
        type: primaryBtns.includes(key) ? 'primary' : ''
      });
    } else if (typeof value === 'object') {
      btns.push({
        ...defaults,
        key: key,
        text: value?.text || key,
        type: primaryBtns.includes(key) ? 'primary' : '',
        ...value,
      });
    }
  }
  return btns;
}

</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  width: 600px;
  height: 207px;
  padding: 0;
  border-radius: var(--widget-border-radius);
}

.icon {
  width: 20px;
  height: 20px;
  color: var(--color-text);
}

.dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .body {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 16px;

    .body-icon {
      width: 40px;
      height: 40px;
    }

    .text {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      color: var(--color-text);
    }
  }

  .footer {
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 25px;

    .el-button {
      min-width: 90px;
      height: 30px;
      margin: 0;
    }
  }
}
</style>