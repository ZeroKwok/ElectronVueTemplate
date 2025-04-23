<template>
  <component :is="windowFrameComponent" :title="$t('app.title')">
    <div class="app">
      <header>
        <a v-if="canGoBack" href="#" class="nav-button back" @click="$router.back()">
          <i class="codicon codicon-arrow-left"></i> {{ $t('app.back') }}
        </a>

        <nav>
          <RouterLink to="/home">{{ $t('home.label') }}</RouterLink>
          <RouterLink to="/about">{{ $t('about.label') }}</RouterLink>
        </nav>

        <label>
          {{ $t('app.language') }}
          <select :value="$store.state.settings.language"
            @change="$store.dispatch('updateLanguage', $event.target.value)">
            <option v-for="(locale, code) in i18n.global.index.locales" :key="code" :value="code">
              {{ locale.name }}({{ code }})
            </option>
          </select>
        </label>

        <label>
          <input type="checkbox" v-model="useRoundedFrame" /> {{ $t('app.use_rounded_frame') }}
        </label>
      </header>

      <div class="container">
        <RouterView />
      </div>
    </div>
  </component>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router';
import i18n from './i18n';

// icons by https://github.com/microsoft/vscode-codicons
import '@vscode/codicons/dist/codicon.css';

const route = useRoute();
const router = useRouter();

const useRoundedFrame = ref(false);
const windowFrameComponent = computed(() => {
  return useRoundedFrame.value
    ? defineAsyncComponent(() => import('./components/RoundedWindowFrame.vue'))
    : defineAsyncComponent(() => import('./components/WindowFrame.vue'))
});

const canGoBack = ref(false);
watch(
  () => router.currentRoute.value,
  () => {
    canGoBack.value = router.options.history.state.back;
  },
  { flush: 'post' }
);
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  header {
    height: 32px;
    display: flex;
    flex-direction: row;
    place-items: center;
    place-content: end;
    line-height: 1.5;
    font-size: 12px;

    a {
      display: inline-block;
      padding: 0 1rem;
      margin-right: auto;
      text-decoration: none;
      font-weight: bold;
      &.router-link-exact-active {
        color: var(--color-text);
        &:hover {
          background-color: transparent;
        }
      }
    }

    .nav-button {
      display: inline-flex;
      gap: 4px;
    }

    nav {
      a {
        border-left: 1px solid var(--color-border);
        &:first-of-type {
          border: 0;
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
}
</style>
