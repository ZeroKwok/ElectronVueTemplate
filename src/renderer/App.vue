
<template>
  <WindowFrame title="标题栏文本: 内容太大而无法放入指定区域时, 将自动省略">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    <div class="wrapper">
      <RouterView />
    </div>
  </WindowFrame>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import WindowFrame from './components/WindowFrame.vue'
import WindowFrame from './components/RoundedWindowFrame.vue'
</script>

<style lang="scss" scoped>

header {
  height: 32px;
  line-height: 1.5;
  display: flex;
  place-items: center;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.wrapper {
  height: calc(100% -  32px);
}

</style>
