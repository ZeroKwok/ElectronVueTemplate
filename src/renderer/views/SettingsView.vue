<template>
  <div class="settings">
    <h1>{{ $t('settings.title') }}</h1>

    <div class="settings-list">
      <label class="settings-item">
        <span class="item-label">{{ $t('settings.language') }}</span>
        <select class="item-value" :value="$store.state.settings.language"
          @change="$store.dispatch('update', { key: 'settings.language', value: $event.target.value })">
          <option v-for="(locale, code) in i18n.global.index.locales" :key="code" :value="code">
            {{ locale.name }}({{ code }})
          </option>
        </select>
      </label>

      <label class="settings-item">
        <span class="item-label">{{ $t('settings.theme') }}</span>
        <select class="item-value" :value="$store.state.settings.theme"
          @change="$store.dispatch('update', { key: 'settings.theme', value: $event.target.value })">
          <option v-for="(name, code) in themeOptions" :key="name" :value="code">
            {{ name }}
          </option>
        </select>
      </label>

      <label class="settings-item">
        <span class="item-label">{{ $t('settings.roundedWindow') }}</span>
        <input class="item-value" type="checkbox" :checked="$store.state.settings.roundedWindow"
          @change="$store.dispatch('update', { key: 'settings.roundedWindow', value: $event.target.checked })" />
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
    align-items: baseline;

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

      input {
        margin-right: auto;
      }
    }
  }
}
</style>