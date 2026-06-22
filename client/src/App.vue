<template>
  <NavBar />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>
:root {
  --bg:     #faf8f4;
  --text:   #2c2825;
  --muted:  #8a7e74;
  --accent: #b5541c;
  --border: #ddd8d0;
  --serif:  'Lora', Georgia, 'Times New Roman', serif;
  --sans:   'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 18px; }

body {
  font-family: var(--sans);
  color: var(--text);
  background: var(--bg);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a { color: inherit; text-decoration: none; }

main { min-height: calc(100vh - 65px); }
</style>
