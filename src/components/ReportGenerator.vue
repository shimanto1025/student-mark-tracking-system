<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-file-earmark-text me-2"></i>Report Generator
        </a>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-light btn-sm me-2" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>Back
          </button>
          <span class="text-white me-3">{{ user?.name }}</span>
          <button class="btn btn-outline-light btn-sm" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="card shadow">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0"><i class="bi bi-printer me-2"></i>Generate Academic Report</h5>
        </div>
        <div class="card-body">
          <!-- Report Controls -->
          <div class="row mb-4">
            <div class="col-md-4">
              <label class="form-label">Select Course</label>
              <select class="form-select" v-model="selectedCourseId">
                <option value="">All Courses</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }} ({{ course.code }})
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Report Type</label>
              <select class="form-select" v-model="reportType">
                <option value="detailed">Detailed Report</option>
                <option value="summary">Summary Report</option>
                <option value="transcript">Academic Transcript</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-primary w-100" @click="generatePDF">
                <i class="bi bi-download me-2"></i>Download PDF Report
              </button>
            </div>
          </div>

          <!-- Report Preview -->
          <div class="report-preview border p-4 bg-white" ref="reportContent">
            <!-- University Header -->
            <div class="text-center mb-4">
              <h2 class="text-primary">Yunnan University</h2>
              <h4 class="text-secondary">Software Engineering Department</h4>
              <h5 class="text-muted">Student Mark Tracking System</h5>
              <hr class="border-primary">
            </div>

            <!-- Student Information -->
            <div class="mb-4">
              <h4 class="border-bottom pb-2">Student Information</h4>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ user?.name }}</p>
                  <p><strong>Student ID:</strong> {{ user?.username }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Email:</strong> {{ user?.email }}</p>
                  <p><strong>Report Date:</strong> {{ new Date().toLocaleDateString() }}</p>
                </div>
              </div>
            </div>

            <!-- Academic Performance -->
            <div class="mb-4">
              <h4 class="border-bottom pb-2">Academic Performance</h4>
              
              <!-- Overall Summary -->
              <div class="card mb-3">
                <div class="card-header bg-light">
                  <h5 class="mb-0">Overall Summary</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-4 text-center">
                      <div class="display-6 text-primary">{{ overallScore.toFixed(1) }}%</div>
                      <small class="text-muted">Overall Score</small>
                    </div>
                    <div class="col-md-4 text-center">
                      <div class="display-6 text-success">{{ calculateGPA().toFixed(2) }}</div>
                      <small class="text-muted">GPA</small>
                    </div>
                    <div class="col-md-4 text-center">
                      <div :class="['display-6', getGradeClass(overallScore, 100)]">
                        {{ calculateGrade(overallScore, 100) }}
                      </div>
                      <small class="text-muted">Overall Grade</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Course-wise Performance -->
              <h5 class="mt-4 mb-3">Course-wise Performance</h5>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead class="table-primary">
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Score (%)</th>
                      <th>Grade</th>
                      <th>GPA Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in filteredCourses" :key="course.id">
                      <td>{{ course.code }}</td>
                      <td>{{ course.name }}</td>
                      <td>{{ calculateCourseScore(course.id).toFixed(1) }}</td>
                      <td :class="getGradeClass(calculateCourseScore(course.id), 100)">
                        {{ calculateGrade(calculateCourseScore(course.id), 100) }}
                      </td>
                      <td>{{ calculateGPAPoints(calculateCourseScore(course.id)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Detailed Marks (for detailed report) -->
              <div v-if="reportType === 'detailed'" class="mt-4">
                <h5 class="mb-3">Detailed Assessment Marks</h5>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered">
                    <thead class="table-secondary">
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
                        <td>{{ (mark.weight * 100).toFixed(1) }}</td>
                        <td>{{ ((mark.marks / mark.maxMarks) * mark.weight * 100).toFixed(1) }}</td>
                        <td :class="getGradeClass(mark.marks, mark.maxMarks)">
                          {{ calculateGrade(mark.marks, mark.maxMarks) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Performance Chart (visual representation) -->
            <div class="mb-4">
              <h5 class="border-bottom pb-2">Performance Chart</h5>
              <div class="chart-container" style="height: 200px;">
                <div class="d-flex align-items-end h-100">
                  <div v-for="course in filteredCourses" :key="course.id" class="chart-bar me-2" :style="{
                    height: calculateCourseScore(course.id) + '%',
                    width: (100 / filteredCourses.length) + '%',
                    backgroundColor: getProgressBarColor(calculateCourseScore(course.id))
                  }">
                    <div class="text-center text-white small">
                      {{ course.code }}<br>
                      {{ calculateCourseScore(course.id).toFixed(0) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-4 pt-4 border-top">
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Generated By:</strong></p>
                  <p>Student Mark Tracking System</p>
                </div>
                <div class="col-md-6 text-end">
                  <p class="mb-1"><strong>Official Use:</strong></p>
                  <p>________________________________</p>
                  <small class="text-muted">Authorized Signature</small>
                </div>
              </div>
              <div class="text-center mt-3">
                <small class="text-muted">
                  This is an unofficial report. For official transcripts, please contact the Registrar's Office.
                  <br>YN3012180058 - Software Engineering Final Project
                </small>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-4 text-center">
            <button class="btn btn-success me-2" @click="printReport">
              <i class="bi bi-printer me-2"></i>Print Report
            </button>
            <button class="btn btn-outline-primary" @click="saveReport">
              <i class="bi bi-save me-2"></i>Save Report
            </button>
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
import html2pdf from 'html2pdf.js'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const marks = ref([])
const courses = ref([])
const selectedCourseId = ref('')
const reportType = ref('detailed')
const reportContent = ref(null)

onMounted(() => {
  user.value = authStore.user
  marks.value = authStore.getStudentMarks(user.value.id)
  courses.value = authStore.getCourses()
})

const filteredCourses = computed(() => {
  if (!selectedCourseId.value) return courses.value
  return courses.value.filter(course => course.id == selectedCourseId.value)
})

const filteredMarks = computed(() => {
  if (!selectedCourseId.value) return marks.value
  return marks.value.filter(mark => mark.courseId == selectedCourseId.value)
})

const overallScore = computed(() => {
  if (marks.value.length === 0) return 0
  
  const totalWeighted = marks.value.reduce((sum, mark) => {
    return sum + (mark.marks / mark.maxMarks) * mark.weight * 100
  }, 0)
  
  const totalWeight = marks.value.reduce((sum, mark) => sum + mark.weight, 0)
  
  return totalWeighted / totalWeight
})

const getCourseName = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  return course ? `${course.name} (${course.code})` : 'Unknown'
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
  return `text-${grade === 'A' ? 'success' : grade === 'B' ? 'primary' : grade === 'C' ? 'info' : grade === 'D' ? 'warning' : 'danger'}`
}

const calculateGPA = () => {
  let totalPoints = 0
  let totalCredits = 0
  
  courses.value.forEach(course => {
    const score = calculateCourseScore(course.id)
    const grade = calculateGrade(score, 100)
    const points = calculateGPAPoints(score)
    
    // Assuming each course has 3 credits
    totalPoints += points * 3
    totalCredits += 3
  })
  
  return totalPoints / totalCredits
}

const calculateGPAPoints = (score) => {
  if (score >= 90) return 4.0
  if (score >= 80) return 3.0
  if (score >= 70) return 2.0
  if (score >= 60) return 1.0
  return 0.0
}

const getProgressBarColor = (score) => {
  if (score >= 80) return '#28a745'
  if (score >= 60) return '#ffc107'
  return '#dc3545'
}

const generatePDF = () => {
  const element = reportContent.value
  const opt = {
    margin:       0.5,
    filename:     `Academic_Report_${user.value.username}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  
  html2pdf().from(element).set(opt).save()
}

const printReport = () => {
  window.print()
}

const saveReport = () => {
  // In a real application, this would save to a database
  alert('Report saved successfully!')
}

const goBack = () => {
  if (user.value.role === 'student') router.push('/student')
  else if (user.value.role === 'teacher') router.push('/teacher')
  else if (user.value.role === 'ta') router.push('/ta')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
@media print {
  .navbar, .btn, .form-control, .form-select {
    display: none !important;
  }
  
  .report-preview {
    border: none !important;
    padding: 0 !important;
  }
}

.chart-bar {
  transition: height 0.5s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}

.chart-container {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
}
</style>