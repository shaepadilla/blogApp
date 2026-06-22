<template>
  <div class="write-wrap">
    <div class="write-inner">
      <div class="write-header">
        <router-link :to="`/posts/${route.params.id}`" class="back-link">&larr; Back to story</router-link>
        <p class="write-label">Edit Story</p>
      </div>

      <p v-if="fetchLoading" class="status">Loading…</p>

      <form v-else @submit.prevent="handleSubmit">
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="Your title here…"
          class="title-input"
        />
        <textarea
          v-model="form.content"
          required
          placeholder="Tell your story…"
          class="content-input"
          rows="18"
        ></textarea>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="actions">
          <router-link :to="`/posts/${route.params.id}`" class="cancel-link">Cancel</router-link>
          <button type="submit" :disabled="loading" class="publish-btn">
            {{ loading ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../api'

const router = useRouter()
const route = useRoute()
const form = ref({ title: '', content: '' })
const error = ref('')
const loading = ref(false)
const fetchLoading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/posts/${route.params.id}`)
    form.value = { title: data.title, content: data.content }
  } catch {
    error.value = 'Failed to load post'
  } finally {
    fetchLoading.value = false
  }
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await api.put(`/posts/${route.params.id}`, form.value)
    router.push(`/posts/${route.params.id}`)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update post'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.write-wrap {
  min-height: calc(100vh - 65px);
  padding: 2rem 1.5rem 5rem;
}

.write-inner {
  max-width: 680px;
  margin: 0 auto;
}

.write-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.back-link {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.15s;
}
.back-link:hover { color: var(--accent); }

.write-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--muted);
}

.title-input {
  width: 100%;
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.title-input::placeholder { color: var(--border); }

.content-input {
  width: 100%;
  font-family: var(--sans);
  font-size: 1rem;
  color: var(--text);
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  line-height: 1.75;
  padding: 0;
}
.content-input::placeholder { color: var(--border); }

.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.cancel-link {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  color: var(--muted);
  transition: color 0.15s;
}
.cancel-link:hover { color: var(--text); }

.publish-btn {
  padding: 0.55rem 1.5rem;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  font-family: var(--sans);
  cursor: pointer;
  transition: opacity 0.15s;
}
.publish-btn:hover { opacity: 0.85; }
.publish-btn:disabled { opacity: 0.5; cursor: default; }

.error { font-size: 0.82rem; color: #c0392b; margin-top: 0.75rem; }
.status { color: var(--muted); font-size: 0.9rem; padding: 2rem 0; }
</style>
