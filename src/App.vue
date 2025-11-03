<template>
  <div id="app">
    <AppNavigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '@/components/navigation/AppNavigation.vue'
</script>

<style>
/* Imports doivent être en premier */
@import '@/styles/variables.css';
@import '@/styles/global.css';
@import 'bulma/css/bulma.min.css';

/* Animations douces */
.button,
.notification {
  transition: all var(--transition-normal);
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Responsive */
@media screen and (max-width: 1023px) {
  .main-content {
    margin-top: 52px;
    min-height: calc(100vh - 52px);
  }
}
</style>
