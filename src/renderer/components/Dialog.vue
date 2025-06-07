<template>
  <div class="dialog">
    <el-dialog 
      :model-value="modelValue" 
      :show-close="false" 
      :modal="modal" 
      :draggable="draggable"
      :close-on-click-modal="false" 
      align-center 
      @update:modelValue="emit('update:modelValue', $event)"
      @closed="emit('closed')"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class='titlebar'>
          <div v-if="$slots.icon">
            <slot name="icon"></slot>
          </div>
          <div :id="titleId" :class="['title', titleClass]">{{ title }}</div>
          <div class="button close codicon codicon-chrome-close" @click="close"></div>
        </div>
      </template>
      <div class="container">
        <slot>Client Area</slot>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'title',
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  modal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'closed']);
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: var(--window-border-radius);
  ;
}

.titlebar {
  display: flex;
  gap: 5px;
  height: 40px;
  align-items: center;
  padding-left: 10px;

  .title {
    font-size: 14px;
    margin-right: auto;
  }

  .button {
    height: 100%;
    width: 46px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    border-top-right-radius: var(--window-border-radius);

    &:hover {
      background: #c42c1b;
      color: rgba(255, 255, 255, 0.8);
    }

    &:active {
      background: #f1707a;
      color: #000;
    }
  }
}

.container {
  padding: 20px;
}
</style>