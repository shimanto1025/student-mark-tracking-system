<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-speedometer2 me-2"></i>Student Dashboard
        </a>
        <div class="d-flex align-items-center">
          <span class="text-white me-3">Welcome, {{ user?.name }}</span>
          <button class="btn btn-outline-light btn-sm" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Student Information -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="bi bi-person-circle me-2"></i>Student Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ user?.name }}</p>
                  <p><strong>Student ID:</strong> {{ user?.username }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Email:</strong> {{ user?.email }}</p>
                  <p><strong>Role:</strong> {{ user?.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marks Overview -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-clipboard-data me-2"></i>Academic Performance</h5>
              <button class="btn btn-light btn-sm" @click="generateReport">
                <i class="bi bi-download me-1"></i>Generate Report
              </button>
            </div>
            <div class="card-body">
              <!-- Course Selection -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="courseSelect" class="form-label">Select Course</label>
                  <select class="form-select" id="courseSelect" v-model="selectedCourseId">
                    <option value="">All Courses</option>
                    <option v-for="course in courses" :key="course.id" :value="course.id">
                      {{ course.name }} ({{ course.code }})
                    </option>
                  </select>
                </div>
              </div>

              <!-- Marks Table -->
              <div class="table-responsive">
                <table class="table table-hover table-striped">
                  <thead class="table-dark">
                    <tr>
                      <th>Course</th>
                      <th>Assessment</th>
                      <th>Marks Obtained</th>
                      <th>Maximum Marks</th>
                      <th>Weight (%)</th>
                      <th>Weighted Score</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="mark in filteredMarks" :key="mark.id">
                      <td>{{ getCourseName(mark.courseId) }}</td>
                      <td>{{ mark.assessment }}</td>
                      <td>{{ mark.marks }}</td>
                      <td>{{ mark.maxMarks }}</td>
                      <td>{{ (mark.weight * 100).toFixed(1) }}%</td>
                      <td>{{ ((mark.marks / mark.maxMarks) * mark.weight * 100).toFixed(1) }}</td>
                      <td>
                        <span :class="getGradeClass(mark.marks, mark.maxMarks)">
                          {{ calculateGrade(mark.marks, mark.maxMarks) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="filteredMarks.length === 0">
                      <td colspan="7" class="text-center text-muted">No marks available</td>
                    </tr>
                  </tbody>
                  <tfoot v-if="filteredMarks.length > 0" class="table-secondary">
                    <tr>
                      <td colspan="5" class="text-end"><strong>Overall Score:</strong></td>
                      <td><strong>{{ calculateOverallScore().toFixed(1) }}%</strong></td>
                      <td>
                        <span :class="getGradeClass(calculateOverallScore(), 100)">
                          {{ calculateGrade(calculateOverallScore(), 100) }}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Summary -->
      <div class="row">
        <div class="col-md-4 mb-3" v-for="course in courses" :key="course.id">
          <div class="card shadow h-100">
            <div class="card-header bg-warning text-dark">
              <h6 class="mb-0">{{ course.name }}</h6>
            </div>
            <div class="card-body">
              <h5 class="text-center">{{ calculateCourseScore(course.id).toFixed(1) }}%</h5>
              <div class="progress mb-2" style="height: 20px;">
                <div class="progress-bar" 
                     :class="getProgressBarClass(calculateCourseScore(course.id))"
                     :style="{ width: calculateCourseScore(course.id) + '%' }"
                     role="progressbar">
                  {{ calculateCourseScore(course.id).toFixed(1) }}%
                </div>
              </div>
              <p class="text-center small">
                Grade: {{ calculateGrade(calculateCourseScore(course.id), 100) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const marks = ref([])
const courses = ref([])
const selectedCourseId = ref('')

onMounted(() => {
  user.value = authStore.user
  marks.value = authStore.getStudentMarks(user.value.id)
  courses.value = authStore.getCourses()
})

const filteredMarks = computed(() => {
  if (!selectedCourseId.value) return marks.value
  return marks.value.filter(mark => mark.courseId == selectedCourseId.value)
})

const getCourseName = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  return course ? `${course.name} (${course.code})` : 'Unknown Course'
}

const calculateGrade = (score, maxScore) => {
  const percentage = (score / maxScore) * 100
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

const getGradeClass = (score, maxScore) => {
  const grade = calculateGrade(score, maxScore)
  switch (grade) {
    case 'A': return 'badge bg-success'
    case 'B': return 'badge bg-primary'
    case 'C': return 'badge bg-info'
    case 'D': return 'badge bg-warning'
    default: return 'badge bg-danger'
  }
}

const calculateOverallScore = () => {
  if (marks.value.length === 0) return 0
  
  const totalWeighted = marks.value.reduce((sum, mark) => {
    return sum + (mark.marks / mark.maxMarks) * mark.weight * 100
  }, 0)
  
  const totalWeight = marks.value.reduce((sum, mark) => sum + mark.weight, 0)
  
  return totalWeighted / totalWeight
}

const calculateCourseScore = (courseId) => {
  const courseMarks = marks.value.filter(mark => mark.courseId === courseId)
  if (courseMarks.length === 0) return 0
  
  const totalWeighted = courseMarks.reduce((sum, mark) => {
    return sum + (mark.marks / mark.maxMarks) * mark.weight * 100
  }, 0)
  
  const totalWeight = courseMarks.reduce((sum, mark) => sum + mark.weight, 0)
  
  return totalWeighted / totalWeight
}

const getProgressBarClass = (score) => {
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-danger'
}

const generateReport = () => {
  router.push('/report')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.badge {
  padding: 0.4em 0.8em;
  font-size: 0.9em;
}
.progress-bar {
  font-size: 0.8em;
  line-height: 20px;
}
</style>