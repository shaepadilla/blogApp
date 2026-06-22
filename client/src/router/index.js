import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import EditPostView from '../views/EditPostView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/posts/:id', component: PostDetailView },
  { path: '/create', component: CreatePostView, meta: { requiresAuth: true } },
  { path: '/posts/:id/edit', component: EditPostView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

export default router
