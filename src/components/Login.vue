<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg" style="width: 400px;">
      <div class="card-header bg-primary text-white text-center">
        <h3 class="mb-0">
          <i class="bi bi-person-badge me-2"></i>
          Student Mark Tracking System
        </h3>
      </div>
      <div class="card-body p-4">
        <h4 class="text-center mb-4">Login</h4>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="username"
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          
          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="remember" v-model="rememberMe" />
            <label class="form-check-label" for="remember">Remember me</label>
          </div>
          
          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
          
          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ error }}
            <button type="button" class="btn-close" @click="error = ''"></button>
          </div>
          
          <div class="text-center mt-3">
            <p class="mb-1">Demo Accounts:</p>
            <small class="text-muted">
              Student: student1 / pass123<br>
              Teacher: teacher1 / pass123<br>
              TA: ta1 / pass123
            </small>
          </div>
        </form>
      </div>
      <div class="card-footer text-center bg-light">
        <small class="text-muted">YN3012180058 - Software Engineering Final Project</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = authStore.login(username.value, password.value)
    
    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'student') {
        router.push('/student')
      } else if (result.user.role === 'teacher') {
        router.push('/teacher')
      } else if (result.user.role === 'ta') {
        router.push('/ta')
      }
    } else {
      error.value = result.message || 'Invalid credentials'
    }
  } catch (err) {
    error.value = 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.card {
  border: none;
  border-radius: 15px;
}
.input-group-text {
  background-color: #f8f9fa;
}
.btn-primary {
  background-color: #4e73df;
  border-color: #4e73df;
}
.btn-primary:hover {
  background-color: #2e59d9;
  border-color: #2653d4;
}
</style>