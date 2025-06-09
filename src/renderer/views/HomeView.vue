<template>
  <div class="home">
    <h1>{{ $t('home.body') }}</h1>
    <div>
      <el-button @click="openMessageBox">Open MessageBox</el-button>
    </div>
  </div>
</template>

<script setup>
import MessageBox from '@/components/MessageBox'

const openMessageBox = async () => {
  console.log('openMessageBox');
  const result = await MessageBox.info({
    title: 'Hello World!',
    text: 'This is a custom message box based on el-dialog.',
    type: 'info',
    buttons: {
      ok: 'Ok',
    }
  });
  console.log(result);
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}
</style>