import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/student',
    name: 'student',
    component: () => import('@/components/StudentView.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: () => import('@/components/TeacherView.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: '/ta',
    name: 'ta',
    component: () => import('@/components/TAView.vue'),
    meta: { requiresAuth: true, role: 'ta' }
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('@/components/ReportGenerator.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  if (to.meta.requiresAuth && !user) {
    next('/')
  } else if (to.meta.role && user?.role !== to.meta.role) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'student') next('/student')
    else if (user?.role === 'teacher') next('/teacher')
    else if (user?.role === 'ta') next('/ta')
    else next('/')
  } else {
    next()
  }
})

export default router