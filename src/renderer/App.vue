<template>
  <component :is="windowFrameComponent" :title="$t('app.title')">
    <div class="app">
      <header>
        <el-link class="nav-back" v-if="canGoBack" underline="never" @click="$router.back()">
          <el-icon>
            <Back />
          </el-icon>
          {{ $t('app.back') }}
        </el-link>

        <nav class="nav-tabs">
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
import i18n from './common/i18n';
import store from './common/state';
import { Back } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

const windowFrameComponent = computed(() => {
  return (store.state.settings?.roundedWindow || false)
    ? defineAsyncComponent(() => import('./components/RoundedWindowFrame.vue'))
    : defineAsyncComponent(() => import('./components/WindowFrame.vue'))
});

// App Theme
const applyTheme = (theme) => {
  const html = document.documentElement
  html.setAttribute('data-theme', theme)

  // Set the theme for Element Plus
  if (theme === 'dark')
    html.classList.add('dark')
  else
    html.classList.remove('dark')
};
applyTheme(store.state.settings.theme);
watch(
  () => store.state.settings.theme,
  (newTheme) => applyTheme(newTheme)
);

// Rounded Window
const applyRounded = (rounded) => {
  const html = document.documentElement
  rounded ? html.setAttribute('rounded', '') : html.removeAttribute('rounded');
};
applyRounded(store.state.settings.roundedWindow);
watch(
  () => store.state.settings.roundedWindow,
  (rounded) => applyRounded(rounded)
);

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
    user-select: none;
    font-size: 13px;


    .nav-back {
      margin: 0 auto 0 12px;
      font-weight: bold;

      i {
        margin-right: 6px;
      }
    }

    .nav-tabs {
      a {
        display: inline-block;
        padding: 0 1rem;
        text-decoration: none;
        color: var(--el-text-color-regular);
        border-left: 1px solid var(--color-border);

        &:hover {
          color: var(--el-color-primary);
        }

        &.router-link-exact-active {
          color: var(--el-color-primary);
          font-weight: var(--el-font-weight-primary);
          text-decoration: underline;
        }

        &:first-of-type {
          border-left: 0;
        }
      }
    }
  }

  .container {
    height: calc(100% - 32px);
  }
}
</style>
