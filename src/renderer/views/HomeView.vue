<template>
  <div class="home">
    <h1>{{ $t('home.body') }}</h1>
    <button @click="openMessageBox">Open MessageBox</button>
  </div>
</template>

<script scoped>
import MessageBox from '@/components/MessageBox'

const openMessageBox = async () => {
  const result = await MessageBox.info({
    title: 'Title',
    text: 'This is a message',
    type: 'info',
    buttons: {
      no: 'No',
      yes: 'Yes',
    }
  });
  console.log(result);
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>