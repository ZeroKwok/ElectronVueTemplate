<template>
  <component :is="windowFrameComponent" :title="$t('app.title')">
    <header>
      <nav>
        <RouterLink to="/">{{ $t('home.label') }}</RouterLink>
        <RouterLink to="/about">{{ $t('about.label') }}</RouterLink>
      </nav>

      <label>
        Language:
        <select v-model="$store.state.settings.language">
          <option v-for="(locale, code) in localeOptions" :key="code" :value="code">
            {{ locale.name }}({{ code }})
          </option>
        </select>
      </label>

      <label>
        <input type="checkbox" v-model="useRoundedFrame" /> {{$t('app.use_rounded_frame')}}
      </label>

    </header>
    <div class="container">
      <RouterView />
    </div>
  </component>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import  i18n  from './i18n';

const useRoundedFrame = ref(false);
const windowFrameComponent = computed(() => {
  return useRoundedFrame.value
  ? defineAsyncComponent(() => import('./components/RoundedWindowFrame.vue'))
  : defineAsyncComponent(() => import('./components/WindowFrame.vue'))
});
const localeOptions = i18n.global.index.locales;
</script>

<style lang="scss" scoped>
header {
  height: 32px;
  line-height: 1.5;
  display: flex;
  place-items: center;
  font-size: 12px;
  nav {
    width: 100%;
    text-align: center;
    a {
      display: inline-block;
      padding: 0 1rem;
      border-left: 1px solid var(--color-border);
      &:first-of-type {
        border: 0;
      }
      &.router-link-exact-active {
        color: var(--color-text);
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
  label {
    display: flex;
    white-space: nowrap;
    padding: 0 10px;
    input {
      margin-right: 5px;
    }
    select {
      margin-left: 5px;
    }
  }
}

.container {
  height: calc(100% - 32px);
}
</style>
