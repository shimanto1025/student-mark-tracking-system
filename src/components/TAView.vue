<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-person-video me-2"></i>Teaching Assistant Dashboard
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
      <!-- TA Information -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="bi bi-person-gear me-2"></i>Teaching Assistant Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ user?.name }}</p>
                  <p><strong>Email:</strong> {{ user?.email }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Role:</strong> {{ user?.role }}</p>
                  <p><strong>Permissions:</strong> Full access to manage marks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note about TA privileges -->
      <div class="alert alert-info mb-4">
        <i class="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> As a Teaching Assistant, you have the same privileges as teachers for managing student marks.
      </div>

      <!-- Marks Management -->
      <div class="card shadow">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0"><i class="bi bi-clipboard-data me-2"></i>Manage Student Marks</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Assessment</th>
                  <th>Marks</th>
                  <th>Max Marks</th>
                  <th>Weight</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mark in allMarks" :key="mark.id">
                  <td>{{ getStudentName(mark.studentId) }}</td>
                  <td>{{ getCourseName(mark.courseId) }}</td>
                  <td>{{ mark.assessment }}</td>
                  <td>
                    <input v-if="mark.editing" type="number" class="form-control form-control-sm" v-model="mark.tempMarks" />
                    <span v-else>{{ mark.marks }}</span>
                  </td>
                  <td>{{ mark.maxMarks }}</td>
                  <td>{{ mark.weight }}</td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <button v-if="!mark.editing" class="btn btn-outline-primary" @click="startEdit(mark)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button v-if="mark.editing" class="btn btn-outline-success" @click="saveEdit(mark)">
                        <i class="bi bi-check"></i>
                      </button>
                      <button v-if="mark.editing" class="btn btn-outline-secondary" @click="cancelEdit(mark)">
                        <i class="bi bi-x"></i>
                      </button>
                      <button class="btn btn-outline-danger" @click="confirmDelete(mark.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="allMarks.length === 0">
                  <td colspan="7" class="text-center text-muted">No marks available</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Add New Marks Form -->
          <div class="mt-4">
            <h5 class="mb-3">Add New Marks</h5>
            <form @submit.prevent="addNewMark">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Student</label>
                  <select class="form-select" v-model="newMark.studentId" required>
                    <option value="">Select Student</option>
                    <option v-for="student in students" :key="student.id" :value="student.id">
                      {{ student.name }} ({{ student.username }})
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Course</label>
                  <select class="form-select" v-model="newMark.courseId" required>
                    <option value="">Select Course</option>
                    <option v-for="course in courses" :key="course.id" :value="course.id">
                      {{ course.name }} ({{ course.code }})
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Assessment Type</label>
                  <select class="form-select" v-model="newMark.assessment" required>
                    <option value="">Select Type</option>
                    <option value="Mid-term Exam">Mid-term Exam</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Classwork">Classwork</option>
                    <option value="Homework">Homework</option>
                    <option value="Final Project">Final Project</option>
                    <option value="Final Examination">Final Examination</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Weight (0-1)</label>
                    <input type="number" class="form-control" v-model="newMark.weight" step="0.1" min="0" max="1" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Marks Obtained</label>
                  <input type="number" class="form-control" v-model="newMark.marks" min="0" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Maximum Marks</label>
                  <input type="number" class="form-control" v-model="newMark.maxMarks" min="1" required>
                </div>
                <div class="col-12">
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">
                      <i class="bi bi-plus-circle me-2"></i>Add Marks
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const allMarks = ref([])
const students = ref([])
const courses = ref([])

const newMark = ref({
  studentId: '',
  courseId: '',
  assessment: '',
  marks: '',
  maxMarks: '',
  weight: ''
})

onMounted(() => {
  user.value = authStore.user
  loadAllData()
})

const loadAllData = () => {
  allMarks.value = authStore.getAllMarks().map(mark => ({
    ...mark,
    editing: false,
    tempMarks: mark.marks
  }))
  students.value = authStore.getStudents()
  courses.value = authStore.getCourses()
}

const getStudentName = (studentId) => {
  const student = students.value.find(s => s.id === studentId)
  return student ? student.name : 'Unknown'
}

const getCourseName = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  return course ? `${course.name} (${course.code})` : 'Unknown'
}

const startEdit = (mark) => {
  mark.editing = true
  mark.tempMarks = mark.marks
}

const saveEdit = (mark) => {
  const success = authStore.updateMark(mark.id, { marks: mark.tempMarks })
  if (success) {
    mark.marks = mark.tempMarks
    mark.editing = false
  }
}

const cancelEdit = (mark) => {
  mark.editing = false
}

const confirmDelete = (markId) => {
  if (confirm('Are you sure you want to delete this mark?')) {
    const success = authStore.deleteMark(markId)
    if (success) {
      loadAllData()
    }
  }
}

const addNewMark = () => {
  const markData = {
    studentId: parseInt(newMark.value.studentId),
    courseId: parseInt(newMark.value.courseId),
    assessment: newMark.value.assessment,
    marks: parseFloat(newMark.value.marks),
    maxMarks: parseFloat(newMark.value.maxMarks),
    weight: parseFloat(newMark.value.weight)
  }
  
  const id = authStore.addMark(markData)
  if (id) {
    alert('Marks added successfully!')
    // Reset form
    newMark.value = {
      studentId: '',
      courseId: '',
      assessment: '',
      marks: '',
      maxMarks: '',
      weight: ''
    }
    loadAllData()
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>