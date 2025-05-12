<template>
  <div class="settings">
    <h1>{{ $t('settings.title') }}</h1>

    <div class="settings-list">
      <label class="settings-item">
        <span class="item-label">{{ $t('settings.language') }}</span>
        <el-select class="item-value" size="small" :model-value="$store.state.settings.language"
          @update:model-value="val => $store.dispatch('update', { key: 'settings.language', value: val })">
          <el-option v-for="(locale, code) in i18n.global.index.locales" :key="code" :value="code" :label="`${locale.name}(${code})`"/>
        </el-select>
      </label>

      <label class="settings-item">
        <span class="item-label">{{ $t('settings.theme') }}</span>
        <el-select class="item-value" size="small" :model-value="$store.state.settings.theme"
          @update:model-value="val => $store.dispatch('update', { key: 'settings.theme', value: val })">
          <el-option v-for="(name, code) in themeOptions" :key="name" :value="code" :label="name"/>
        </el-select>
      </label>

      <label class="settings-item">
        <span class="item-label">{{ $t('settings.roundedWindow') }}</span>
        <el-switch class="item-value" size="small"
          :model-value="$store.state.settings.roundedWindow"
          @update:model-value="val => $store.dispatch('update', { key: 'settings.roundedWindow', value: val })" />
      </label>
    </div>
  </div>
</template>

<script setup>
import i18n from '@/i18n';
import store from '@/common/state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const themeOptions = computed(() => ({
  'light': t('settings.themeOptions.light'),
  'dark': t('settings.themeOptions.dark')
}));
</script>

<style lang="scss">
.settings {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: 2rem;
    margin-bottom: 50px;
  }

  .settings-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;

    .settings-item {
      display: contents;

      .item-label {
        font-weight: 500;
        text-align: right;
        padding-right: 0.5rem 0;
      }

      .item-value {
        text-align: left;
      }
    }
  }
}
</style>