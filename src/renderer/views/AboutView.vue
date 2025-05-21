<template>
  <div class="about">
    <h1 class="title">{{ $t('about.title') }}</h1>
    <p class="text">{{ $t('about.body') }}</p>
    
    <div class="info-list">
      <div v-for="(item, key) in versionInfo" :key="key" class="info-item">
        <span class="info-label">{{ key }}:</span>
        <span class="info-value">{{ item }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { version as vueVersion } from 'vue'
export default {
  computed: {
    versionInfo() {
      const { app, versions, os } = this.$store.state.shared
      return {
        'Product': app.name,
        'Version': app.version,
        ...(versions ?
          {
            'Vue.js': vueVersion,
            'Node.js': versions?.node,
            'Electron': versions?.electron,
            'Chrome': versions?.chrome,
            'V8': versions?.v8,
          } : {}),
        ...(os ? { 'OS': `${os.type} ${os.arch} ${os.release}` } : {})
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
  gap: 0.5rem;
  
  .info-list {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    align-items: baseline;

    .info-item {
      display: contents;

      .info-label {
        font-weight: 500;
        text-align: right;
        padding-right: 0.5rem 0;
      }

      .info-value {
        word-break: break-word;
        text-align: left;
      }
    }
  }

  .text {
    font-size: 1rem;
    font-weight: lighter;
    text-align: center;
  }

}
</style>
