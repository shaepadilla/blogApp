<template>
  <nav>
    <div class="nav-inner">
      <router-link to="/" class="brand">The Journal</router-link>
      <div class="nav-links">
        <template v-if="isLoggedIn">
          <span class="username">{{ username }}</span>
          <router-link to="/create" class="nav-write">Write</router-link>
          <button @click="logout" class="nav-btn">Sign out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Sign in</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function getToken() { return localStorage.getItem('token') }

function parseUsername(token) {
  if (!token) return ''
  try { return JSON.parse(atob(token.split('.')[1])).username } catch { return '' }
}

const isLoggedIn = ref(!!getToken())
const username = ref(parseUsername(getToken()))

router.afterEach(() => {
  const token = getToken()
  isLoggedIn.value = !!token
  username.value = parseUsername(token)
})

function logout() {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  username.value = ''
  router.push('/login')
}
</script>

<style scoped>
nav {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.brand {
  font-family: var(--serif);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}

.nav-link,
.nav-btn {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--sans);
  transition: color 0.15s;
  padding: 0;
}

.nav-link:hover,
.nav-btn:hover { color: var(--accent); }

.nav-write {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  color: var(--accent);
  transition: opacity 0.15s;
}

.nav-write:hover { opacity: 0.75; }

.username {
  font-size: 0.78rem;
  color: var(--muted);
}
</style>
