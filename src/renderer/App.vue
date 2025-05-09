<template>
  <component :is="windowFrameComponent" :title="$t('app.title')">
    <div class="app">
      <header>
        <a v-if="canGoBack" href="#" class="nav-button back" @click="$router.back()">
          <i class="codicon codicon-arrow-left"></i> {{ $t('app.back') }}
        </a>

        <nav>
          <RouterLink to="/home">{{ $t('app.nav.home') }}</RouterLink>
          <RouterLink to="/settings">{{ $t('app.nav.settings') }}</RouterLink>
          <RouterLink to="/about">{{ $t('app.nav.about') }}</RouterLink>
        </nav>
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
import store from './common/state';

const route = useRoute();
const router = useRouter();

const windowFrameComponent = computed(() => {
  return (store.state.settings?.roundedWindow || false)
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
      color: var(--color-text-secondary);

      &.router-link-exact-active {
        color: green;
        text-decoration: underline;

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
  }

  .container {
    height: calc(100% - 32px);
  }
}
</style>
