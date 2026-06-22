<template>
  <div class="article-wrap">
    <p v-if="loading" class="status">Loading...</p>
    <p v-else-if="error" class="status error">{{ error }}</p>

    <article v-else class="article">

      <header class="article-header">
        <router-link to="/" class="back-link">&larr; All Stories</router-link>

        <h1 class="article-title">{{ post.title }}</h1>

        <div class="article-byline">
          <span>By <strong>{{ post.author?.username }}</strong></span>
          <span class="dot">&nbsp;·&nbsp;</span>
          <span>{{ formatDate(post.createdAt) }}</span>
          <span class="dot">&nbsp;·&nbsp;</span>
          <span>{{ readTime(post.content) }} min read</span>
          <template v-if="isOwner">
            <span class="dot">&nbsp;·&nbsp;</span>
            <router-link :to="`/posts/${post._id}/edit`" class="owner-link">Edit</router-link>
            <span class="dot">&nbsp;·&nbsp;</span>
            <button @click="deletePost" class="owner-btn">Delete</button>
          </template>
        </div>
      </header>

      <div class="article-hero" :style="heroBg"></div>

      <div class="article-body">
        <p
          v-for="(para, i) in paragraphs"
          :key="i"
          :class="['para', i === 0 ? 'drop-cap' : '', isPullQuote(para, i) ? 'pull-quote' : '']"
        >{{ para }}</p>
      </div>

      <hr class="section-rule" />

      <section class="comments">
        <h3 class="comments-heading">
          {{ post.comments?.length || 0 }} {{ post.comments?.length === 1 ? 'Response' : 'Responses' }}
        </h3>

        <div v-if="isLoggedIn" class="comment-form">
          <textarea v-model="commentContent" placeholder="Share your thoughts…" rows="3"></textarea>
          <button @click="addComment" :disabled="commentLoading" class="submit-btn">
            {{ commentLoading ? 'Posting…' : 'Post response' }}
          </button>
          <p v-if="commentError" class="error">{{ commentError }}</p>
        </div>
        <p v-else class="login-prompt">
          <router-link to="/login">Sign in</router-link> to leave a response.
        </p>

        <p v-if="post.comments?.length === 0" class="no-comments">No responses yet.</p>

        <div v-for="comment in post.comments" :key="comment._id" class="comment">
          <p class="comment-byline">
            <strong>{{ comment.author?.username }}</strong>
            <span class="dot">&nbsp;·&nbsp;</span>
            <span>{{ formatDate(comment.createdAt) }}</span>
          </p>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </section>

    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const loading = ref(true)
const error = ref('')
const commentContent = ref('')
const commentLoading = ref(false)
const commentError = ref('')

const GRADIENTS = [
  'linear-gradient(135deg, #c9a882 0%, #7a5030 100%)',
  'linear-gradient(135deg, #c4856a 0%, #6b3a20 100%)',
  'linear-gradient(135deg, #a8956e 0%, #5c3d24 100%)',
  'linear-gradient(135deg, #b8a070 0%, #6b4830 100%)',
  'linear-gradient(135deg, #c0907a 0%, #7a3828 100%)',
]

const heroBg = computed(() => {
  if (!post.value) return {}
  const idx = post.value._id.charCodeAt(post.value._id.length - 1) % GRADIENTS.length
  return { background: GRADIENTS[idx], filter: 'saturate(0.8)' }
})

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const currentUserId = computed(() => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try { return JSON.parse(atob(token.split('.')[1])).id } catch { return null }
})

const isOwner = computed(() => post.value && currentUserId.value === post.value.author?._id)

const paragraphs = computed(() => {
  if (!post.value?.content) return []
  return post.value.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
})

function isPullQuote(para, i) {
  return i > 0 && i < paragraphs.value.length - 1 && para.length < 140 &&
    (para.startsWith('“') || para.startsWith('"') || para.startsWith('‘'))
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function readTime(content) {
  return Math.max(1, Math.ceil((content || '').split(/\s+/).length / 200))
}

async function fetchPost() {
  loading.value = true
  try {
    const { data } = await api.get(`/posts/${route.params.id}`)
    post.value = data
  } catch {
    error.value = 'Post not found.'
  } finally {
    loading.value = false
  }
}

async function deletePost() {
  if (!confirm('Delete this post?')) return
  try {
    await api.delete(`/posts/${post.value._id}`)
    router.push('/')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete post')
  }
}

async function addComment() {
  if (!commentContent.value.trim()) return
  commentError.value = ''
  commentLoading.value = true
  try {
    const { data } = await api.post(`/posts/${post.value._id}/comments`, { content: commentContent.value })
    post.value.comments = data.comments
    commentContent.value = ''
  } catch (err) {
    commentError.value = err.response?.data?.message || 'Failed to post response'
  } finally {
    commentLoading.value = false
  }
}

onMounted(fetchPost)
</script>

<style scoped>
.article-wrap {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 1.5rem 5rem;
}

/* Header */
.article-header {
  padding: 2.5rem 0 2rem;
}

.back-link {
  display: inline-block;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
  color: var(--muted);
  margin-bottom: 1.6rem;
  transition: color 0.15s;
}
.back-link:hover { color: var(--accent); }

.article-title {
  font-family: var(--serif);
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 1.2rem;
}

.article-byline {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
}

.dot { color: var(--border); }

.owner-link,
.owner-btn {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--sans);
  padding: 0;
  transition: color 0.15s;
}
.owner-link:hover { color: var(--accent); }
.owner-btn:hover { color: #c0392b; }

/* Hero image */
.article-hero {
  width: 100%;
  height: 360px;
  margin-bottom: 3rem;
  border-radius: 2px;
}

/* Body */
.article-body {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text);
}

.para {
  margin-bottom: 1.5rem;
}

/* Drop cap */
.drop-cap::first-letter {
  font-family: var(--serif);
  font-size: 4.8rem;
  font-weight: 700;
  line-height: 0.78;
  float: left;
  margin: 0.08em 0.1em -0.05em 0;
  color: var(--text);
}

/* Pull quote */
.pull-quote {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.35rem;
  line-height: 1.5;
  color: var(--text);
  border-left: 2px solid var(--accent);
  padding: 0.5rem 0 0.5rem 1.5rem;
  margin: 2rem 0;
}

/* Divider */
.section-rule {
  border: none;
  border-top: 1px solid var(--border);
  margin: 3rem 0;
}

/* Comments */
.comments-heading {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  font-size: 0.95rem;
  font-family: var(--sans);
  color: var(--text);
  resize: none;
  outline: none;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  transition: border-color 0.15s;
}
.comment-form textarea:focus { border-color: var(--accent); }
.comment-form textarea::placeholder { color: var(--muted); }

.submit-btn {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: var(--text);
  color: var(--bg);
  border: none;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  font-family: var(--sans);
  cursor: pointer;
  transition: background 0.15s;
}
.submit-btn:hover { background: var(--accent); }
.submit-btn:disabled { opacity: 0.5; cursor: default; }

.login-prompt {
  font-size: 0.88rem;
  color: var(--muted);
  margin-bottom: 1.5rem;
}
.login-prompt a { color: var(--accent); text-decoration: underline; }

.no-comments { font-size: 0.88rem; color: var(--muted); }

.comment {
  padding: 1.25rem 0;
  border-top: 1px solid var(--border);
}

.comment-byline {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.comment-text {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text);
}

.status { text-align: center; color: var(--muted); padding: 3rem 0; font-size: 0.9rem; }
.error { color: #c0392b; }
</style>
