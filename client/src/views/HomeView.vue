<template>
  <div class="home">

    <!-- Featured hero: first post -->
    <section v-if="!loading && !error && featured" class="hero">
      <div class="hero-image" :style="heroBg(featured)"></div>
      <div class="hero-content-wrap">
        <div class="hero-content">
          <p class="hero-label">Featured Story</p>
          <router-link :to="`/posts/${featured._id}`" class="hero-title-link">
            <h1 class="hero-title">{{ featured.title }}</h1>
          </router-link>
          <p class="hero-byline">
            <span>By {{ featured.author?.username }}</span>
            <span class="dot">&nbsp;·&nbsp;</span>
            <span>{{ formatDate(featured.createdAt) }}</span>
            <span class="dot">&nbsp;·&nbsp;</span>
            <span>{{ readTime(featured.content) }} min read</span>
          </p>
          <p class="hero-preview">{{ featured.content.slice(0, 180) }}{{ featured.content.length > 180 ? '…' : '' }}</p>
          <router-link :to="`/posts/${featured._id}`" class="hero-cta">Read story &rarr;</router-link>
        </div>
      </div>
    </section>

    <div class="home-body">
      <div class="home-header">
        <p class="section-label">Latest Stories</p>
        <router-link v-if="isLoggedIn" to="/create" class="write-btn">+ New post</router-link>
      </div>

      <p v-if="loading" class="status">Loading...</p>
      <p v-else-if="error" class="status error">{{ error }}</p>
      <p v-else-if="posts.length === 0" class="status">No posts yet. Be the first to write.</p>

      <div v-else class="post-list">
        <article v-for="post in remainingPosts" :key="post._id" class="post-item">
          <div class="item-meta">
            <span>{{ post.author?.username }}</span>
            <span class="dot">&nbsp;·&nbsp;</span>
            <span>{{ formatDate(post.createdAt) }}</span>
            <span class="dot">&nbsp;·&nbsp;</span>
            <span>{{ readTime(post.content) }} min read</span>
          </div>
          <router-link :to="`/posts/${post._id}`" class="item-title-link">
            <h2 class="item-title">{{ post.title }}</h2>
          </router-link>
          <p class="item-preview">{{ post.content.slice(0, 160) }}{{ post.content.length > 160 ? '…' : '' }}</p>
          <div class="item-footer">
            <router-link :to="`/posts/${post._id}`" class="read-link">Read &rarr;</router-link>
            <div v-if="isOwner(post)" class="owner-actions">
              <router-link :to="`/posts/${post._id}/edit`" class="action-link">Edit</router-link>
              <span class="dot">&nbsp;·&nbsp;</span>
              <button @click="deletePost(post._id)" class="action-link action-delete">Delete</button>
            </div>
          </div>
          <hr class="divider" />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'

const posts = ref([])
const loading = ref(true)
const error = ref('')

const GRADIENTS = [
  'linear-gradient(135deg, #c9a882 0%, #7a5030 100%)',
  'linear-gradient(135deg, #c4856a 0%, #6b3a20 100%)',
  'linear-gradient(135deg, #a8956e 0%, #5c3d24 100%)',
  'linear-gradient(135deg, #b8a070 0%, #6b4830 100%)',
  'linear-gradient(135deg, #c0907a 0%, #7a3828 100%)',
]

function heroBg(post) {
  const idx = post._id ? post._id.charCodeAt(post._id.length - 1) % GRADIENTS.length : 0
  return { background: GRADIENTS[idx] }
}

const currentUserId = computed(() => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try { return JSON.parse(atob(token.split('.')[1])).id } catch { return null }
})

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const featured = computed(() => posts.value[0] || null)
const remainingPosts = computed(() => posts.value.slice(1))

function isOwner(post) {
  return currentUserId.value && post.author?._id === currentUserId.value
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function readTime(content) {
  return Math.max(1, Math.ceil((content || '').split(/\s+/).length / 200))
}

async function fetchPosts() {
  loading.value = true
  try {
    const { data } = await api.get('/posts')
    posts.value = data
  } catch {
    error.value = 'Failed to load posts.'
  } finally {
    loading.value = false
  }
}

async function deletePost(id) {
  if (!confirm('Delete this post?')) return
  try {
    await api.delete(`/posts/${id}`)
    posts.value = posts.value.filter(p => p._id !== id)
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete post')
  }
}

onMounted(fetchPosts)
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 480px;
  filter: saturate(0.8);
}

.hero-content-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(to top, rgba(20,14,10,0.72) 0%, rgba(20,14,10,0.15) 55%, transparent 100%);
}

.hero-content {
  max-width: 760px;
  padding: 3rem 3rem 3rem;
  color: #f5efe8;
}

.hero-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: #e8c9a8;
  margin-bottom: 0.75rem;
}

.hero-title-link { display: block; }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.12;
  color: #faf8f4;
  margin-bottom: 0.9rem;
  letter-spacing: -0.02em;
}

.hero-title-link:hover .hero-title { text-decoration: underline; text-decoration-color: rgba(250,248,244,0.5); }

.hero-byline {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4c4b0;
  margin-bottom: 0.9rem;
}

.hero-preview {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e8ddd2;
  max-width: 560px;
  margin-bottom: 1.4rem;
}

.hero-cta {
  display: inline-block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: #f5efe8;
  border-bottom: 1px solid rgba(245,239,232,0.5);
  padding-bottom: 2px;
  transition: border-color 0.15s;
}
.hero-cta:hover { border-color: #f5efe8; }

/* Body */
.home-body {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--text);
}

.section-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: var(--muted);
}

.write-btn {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--accent);
  transition: opacity 0.15s;
}
.write-btn:hover { opacity: 0.7; }

/* Post list */
.post-list { display: flex; flex-direction: column; }

.post-item { padding: 2rem 0 0; }

.item-meta {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 0.6rem;
}

.item-title-link { display: block; }

.item-title {
  font-family: var(--serif);
  font-size: 1.55rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin-bottom: 0.6rem;
  color: var(--text);
  transition: color 0.15s;
}
.item-title-link:hover .item-title { color: var(--accent); }

.item-preview {
  font-size: 0.94rem;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 1rem;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.read-link {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--accent);
  transition: opacity 0.15s;
}
.read-link:hover { opacity: 0.7; }

.owner-actions {
  display: flex;
  align-items: center;
  font-size: 0.72rem;
  color: var(--muted);
}

.action-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.72rem;
  font-family: var(--sans);
  color: var(--muted);
  transition: color 0.15s;
}
.action-link:hover { color: var(--text); }
.action-delete:hover { color: #c0392b; }

.dot { color: var(--border); }

.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 0;
}

.status { text-align: center; color: var(--muted); padding: 3rem 0; font-size: 0.9rem; }
.error { color: #c0392b; }
</style>
