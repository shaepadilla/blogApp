<template>
  <div class="auth-wrap">
    <div class="auth-box">
      <p class="auth-label">The Journal</p>
      <h1 class="auth-heading">Create an account</h1>
      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>Username</label>
          <input v-model="form.username" type="text" required placeholder="Choose a username" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" required placeholder="you@example.com" />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" required placeholder="Create a password" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>
      <p class="auth-footer">Already have an account? <router-link to="/login">Sign in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const form = ref({ username: '', email: '', password: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await api.post('/users/register', form.value)
    success.value = 'Account created! Redirecting…'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-box {
  width: 100%;
  max-width: 400px;
}

.auth-label {
  font-family: var(--serif);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;
}

.auth-heading {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

.field { margin-bottom: 1.25rem; }

label {
  display: block;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.6rem 0;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  font-size: 1rem;
  font-family: var(--sans);
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}
input:focus { border-color: var(--accent); }
input::placeholder { color: var(--border); }

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--text);
  color: var(--bg);
  border: none;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  font-family: var(--sans);
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.15s;
}
.submit-btn:hover { background: var(--accent); }
.submit-btn:disabled { opacity: 0.5; cursor: default; }

.error { font-size: 0.82rem; color: #c0392b; margin-top: 0.5rem; }
.success { font-size: 0.82rem; color: #2d7a4f; margin-top: 0.5rem; }

.auth-footer {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--muted);
  text-align: center;
}
.auth-footer a { color: var(--accent); text-decoration: underline; }
</style>
