<template>
  <div class="about">
    <h1 class="title">{{ $store.state.shared.app.name }}</h1>
    
    <div class="info-list">
      <div v-for="(item, key) in versionInfo" :key="key" class="info-item">
        <span class="info-label">{{ key }}:</span>
        <span class="info-value">{{ item }}</span>
      </div>
    </div>

    <h2 class="text">{{ $t('about.text') }}</h2>
  </div>
</template>

<script>
export default {
  computed: {
    versionInfo() {
      const { app, versions, os } = this.$store.state.shared
      return {
        'Version': app.version,
        'Electron': versions.electron,
        'Chrome': versions.chrome,
        'Node.js': versions.node,
        'V8': versions.v8,
        'OS': `${os.type} ${os.arch} ${os.release}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .info-list {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    align-items: baseline;

    .info-item {
      display: contents;

      .info-label {
        font-weight: 500;
        color: #7f8c8d;
        text-align: right;
        padding-right: 0.5rem 0;
      }

      .info-value {
        color: #2c3e50;
        word-break: break-word;
        text-align: left;
      }
    }
  }

  .text {
    margin-top: 1.5rem;
    color: #2c3e50;
    text-align: center;
    font-weight: lighter;
  }
}
</style>
