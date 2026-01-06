<template>
  <div class="container-fluid">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-person-badge me-2"></i>Teacher Dashboard
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
      <!-- Teacher Information -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="bi bi-person-workspace me-2"></i>Teacher Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ user?.name }}</p>
                  <p><strong>Email:</strong> {{ user?.email }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Role:</strong> {{ user?.role }}</p>
                  <p><strong>Assigned Courses:</strong> {{ assignedCourses.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs for different sections -->
      <ul class="nav nav-tabs mb-4" id="teacherTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="marks-tab" data-bs-toggle="tab" data-bs-target="#marks" type="button">
            <i class="bi bi-clipboard-data me-1"></i>Manage Marks
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="add-tab" data-bs-toggle="tab" data-bs-target="#add" type="button">
            <i class="bi bi-plus-circle me-1"></i>Add Marks
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="rules-tab" data-bs-toggle="tab" data-bs-target="#rules" type="button">
            <i class="bi bi-gear me-1"></i>Course Rules
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="students-tab" data-bs-toggle="tab" data-bs-target="#students" type="button">
            <i class="bi bi-people me-1"></i>Students List
          </button>
        </li>
      </ul>

      <!-- Tab content -->
      <div class="tab-content" id="teacherTabsContent">
        <!-- Manage Marks Tab -->
        <div class="tab-pane fade show active" id="marks" role="tabpanel">
          <div class="card shadow">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0"><i class="bi bi-pencil-square me-2"></i>Manage Student Marks</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Filter by Course</label>
                <select class="form-select w-auto d-inline-block ms-2" v-model="selectedCourseFilter" @change="filterMarks">
                  <option value="">All Courses</option>
                  <option v-for="course in assignedCourses" :key="course.id" :value="course.id">
                    {{ course.name }} ({{ course.code }})
                  </option>
                </select>
              </div>
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
                    <tr v-for="mark in filteredMarks" :key="mark.id">
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
                    <tr v-if="filteredMarks.length === 0">
                      <td colspan="7" class="text-center text-muted">No marks available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Marks Tab -->
        <div class="tab-pane fade" id="add" role="tabpanel">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-plus-circle me-2"></i>Add New Marks</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="addNewMark">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Course</label>
                    <select class="form-select" v-model="newMark.courseId" @change="loadCourseRules" required>
                      <option value="">Select Course</option>
                      <option v-for="course in assignedCourses" :key="course.id" :value="course.id">
                        {{ course.name }} ({{ course.code }})
                      </option>
                    </select>
                  </div>
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
                    <label class="form-label">Assessment Type</label>
                    <select class="form-select" v-model="newMark.assessment" required>
                      <option value="">Select Type</option>
                      <option v-for="assessment in availableAssessments" :key="assessment" :value="assessment">
                        {{ assessment }}
                      </option>
                      <option value="Custom">Custom Assessment</option>
                    </select>
                    <div v-if="newMark.assessment === 'Custom'" class="mt-2">
                      <input type="text" class="form-control" v-model="customAssessment" placeholder="Enter custom assessment name">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Weight</label>
                    <div class="input-group">
                      <input type="number" class="form-control" v-model="newMark.weight" step="0.1" min="0" max="1" required>
                      <span class="input-group-text">(0-1)</span>
                    </div>
                    <small class="form-text text-muted">
                      Predefined weight: {{ selectedCourseWeight }}% 
                      <span v-if="selectedCourseWeight > 0">({{ (selectedCourseWeight / 100).toFixed(1) }})</span>
                    </small>
                    <button v-if="selectedCourseWeight > 0" type="button" class="btn btn-sm btn-link p-0 mt-1" @click="applyPredefinedWeight">
                      Use predefined weight
                    </button>
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

        <!-- Course Rules Tab -->
        <div class="tab-pane fade" id="rules" role="tabpanel">
          <div class="card shadow">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0"><i class="bi bi-gear me-2"></i>Course Assessment Rules</h5>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <label class="form-label">Select Course</label>
                  <select class="form-select" v-model="selectedCourseForRules" @change="loadCourseRules">
                    <option value="">Select a course</option>
                    <option v-for="course in assignedCourses" :key="course.id" :value="course.id">
                      {{ course.name }} ({{ course.code }})
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="selectedCourseForRules">
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Define Assessment Weights for {{ getCourseName(selectedCourseForRules) }}</h6>
                  </div>
                  <div class="card-body">
                    <div v-for="(rule, index) in courseRules" :key="index" class="row mb-3 align-items-center">
                      <div class="col-md-4">
                        <input type="text" class="form-control" v-model="rule.assessment" placeholder="Assessment name" required>
                      </div>
                      <div class="col-md-3">
                        <div class="input-group">
                          <input type="number" class="form-control" v-model="rule.weight" step="0.1" min="0" max="1" placeholder="0.0" required>
                          <span class="input-group-text">(0-1)</span>
                        </div>
                      </div>
                      <div class="col-md-2">
                        <span class="badge bg-info">{{ (rule.weight * 100).toFixed(0) }}%</span>
                      </div>
                      <div class="col-md-3">
                        <button class="btn btn-outline-danger btn-sm" @click="removeRule(index)">
                          <i class="bi bi-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <button class="btn btn-outline-primary btn-sm" @click="addRule">
                        <i class="bi bi-plus"></i> Add Assessment Type
                      </button>
                    </div>
                    
                    <div class="alert alert-info">
                      <strong>Total Weight:</strong> {{ totalWeight }} ({{ (totalWeight * 100).toFixed(0) }}%)
                      <span v-if="totalWeight !== 1" class="text-danger">
                        - Should total 1.0 (100%)
                      </span>
                      <span v-else class="text-success">
                        ✓ Weight distribution is valid
                      </span>
                    </div>
                    
                    <div class="d-flex justify-content-between">
                      <button class="btn btn-success" @click="saveCourseRules" :disabled="totalWeight !== 1">
                        <i class="bi bi-save me-1"></i>Save Rules
                      </button>
                      <button class="btn btn-outline-secondary" @click="loadCourseRules">
                        <i class="bi bi-arrow-clockwise me-1"></i>Reset
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Existing Rules Display -->
                <div class="card">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Current Rules</h6>
                  </div>
                  <div class="card-body">
                    <div v-if="existingRules.length > 0" class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Assessment Type</th>
                            <th>Weight</th>
                            <th>Percentage</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(rule, index) in existingRules" :key="index">
                            <td>{{ rule.assessment }}</td>
                            <td>{{ rule.weight }}</td>
                            <td>{{ (rule.weight * 100).toFixed(0) }}%</td>
                            <td>
                              <button class="btn btn-sm btn-outline-warning me-1" @click="editRule(index)">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger" @click="deleteRule(rule.id)">
                                <i class="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else class="text-center text-muted">
                      No rules defined for this course
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted">
                Please select a course to define assessment rules
              </div>
            </div>
          </div>
        </div>

        <!-- Students List Tab -->
        <div class="tab-pane fade" id="students" role="tabpanel">
          <div class="card shadow">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0"><i class="bi bi-people me-2"></i>Student List</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in students" :key="student.id">
                      <td>{{ student.id }}</td>
                      <td>{{ student.name }}</td>
                      <td>{{ student.username }}</td>
                      <td>{{ student.email }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-info" @click="viewStudentMarks(student.id)">
                          <i class="bi bi-eye me-1"></i>View Marks
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const allMarks = ref([])
const students = ref([])
const courses = ref([])
const courseRules = ref([])
const existingRules = ref([])
const selectedCourseFilter = ref('')
const selectedCourseForRules = ref('')
const selectedCourseWeight = ref(0)
const customAssessment = ref('')

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

const assignedCourses = computed(() => {
  return courses.value.filter(course => course.teacherId === user.value.id)
})

const filteredMarks = computed(() => {
  if (!selectedCourseFilter.value) return allMarks.value
  return allMarks.value.filter(mark => mark.courseId === parseInt(selectedCourseFilter.value))
})

const totalWeight = computed(() => {
  return courseRules.value.reduce((sum, rule) => sum + parseFloat(rule.weight || 0), 0)
})

const availableAssessments = computed(() => {
  if (!newMark.value.courseId) return []
  const courseId = parseInt(newMark.value.courseId)
  const rules = authStore.getCourseRules(courseId)
  return rules.map(rule => rule.assessment)
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

const filterMarks = () => {
  // The computed property will handle filtering
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
  const assessment = newMark.value.assessment === 'Custom' ? customAssessment.value : newMark.value.assessment
  
  const markData = {
    studentId: parseInt(newMark.value.studentId),
    courseId: parseInt(newMark.value.courseId),
    assessment: assessment,
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
    customAssessment.value = ''
    loadAllData()
  }
}

const applyPredefinedWeight = () => {
  newMark.value.weight = (selectedCourseWeight.value / 100).toFixed(1)
}

const loadCourseRules = () => {
  if (selectedCourseForRules.value) {
    const courseId = parseInt(selectedCourseForRules.value)
    existingRules.value = authStore.getCourseRules(courseId)
    courseRules.value = existingRules.value.map(rule => ({ ...rule }))
  }
  
  if (newMark.value.courseId) {
    const courseId = parseInt(newMark.value.courseId)
    const rules = authStore.getCourseRules(courseId)
    // Find weight for selected assessment
    if (newMark.value.assessment && rules.length > 0) {
      const rule = rules.find(r => r.assessment === newMark.value.assessment)
      selectedCourseWeight.value = rule ? rule.weight * 100 : 0
    }
  }
}

const addRule = () => {
  courseRules.value.push({
    assessment: '',
    weight: 0.1,
    courseId: parseInt(selectedCourseForRules.value)
  })
}

const removeRule = (index) => {
  courseRules.value.splice(index, 1)
}

const saveCourseRules = () => {
  if (totalWeight.value !== 1) {
    alert('Total weight must equal 1.0 (100%)')
    return
  }
  
  const courseId = parseInt(selectedCourseForRules.value)
  const success = authStore.saveCourseRules(courseId, courseRules.value)
  
  if (success) {
    alert('Course rules saved successfully!')
    loadCourseRules()
  }
}

const editRule = (index) => {
  const rule = existingRules.value[index]
  courseRules.value = [{
    assessment: rule.assessment,
    weight: rule.weight,
    courseId: rule.courseId
  }]
}

const deleteRule = (ruleId) => {
  if (confirm('Are you sure you want to delete this rule?')) {
    const success = authStore.deleteCourseRule(ruleId)
    if (success) {
      loadCourseRules()
    }
  }
}

const viewStudentMarks = (studentId) => {
  alert(`Viewing marks for student ID: ${studentId}`)
  // In a real app, you might navigate to a detailed view
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Watch for assessment selection to auto-fill weight
watch(() => newMark.value.assessment, (newAssessment) => {
  if (newMark.value.courseId && newAssessment) {
    const courseId = parseInt(newMark.value.courseId)
    const rules = authStore.getCourseRules(courseId)
    const rule = rules.find(r => r.assessment === newAssessment)
    if (rule) {
      newMark.value.weight = rule.weight
      selectedCourseWeight.value = rule.weight * 100
    }
  }
})

// Watch for course selection to reset assessment
watch(() => newMark.value.courseId, () => {
  newMark.value.assessment = ''
  selectedCourseWeight.value = 0
})
</script>

<style scoped>
.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.nav-tabs .nav-link.active {
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

.form-control-sm {
  width: 80px;
}

.badge {
  font-size: 0.9em;
  padding: 0.5em 0.8em;
}

.alert {
  margin-bottom: 1rem;
}

.table-sm th,
.table-sm td {
  padding: 0.5rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #ced4da;
}
</style>