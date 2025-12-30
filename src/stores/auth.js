import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isAuthenticated = ref(!!user.value)

  // Mock user data
  const mockUsers = [
    // Students
    { id: 1, username: 'student1', password: 'pass123', name: 'John Doe', role: 'student', email: 'john@example.com' },
    { id: 2, username: 'student2', password: 'pass123', name: 'Jane Smith', role: 'student', email: 'jane@example.com' },
    { id: 3, username: 'student3', password: 'pass123', name: 'Bob Johnson', role: 'student', email: 'bob@example.com' },
    { id: 4, username: 'student4', password: 'pass123', name: 'Alice Brown', role: 'student', email: 'alice@example.com' },
    { id: 5, username: 'student5', password: 'pass123', name: 'Charlie Wilson', role: 'student', email: 'charlie@example.com' },
    { id: 6, username: 'student6', password: 'pass123', name: 'Diana Prince', role: 'student', email: 'diana@example.com' },
    { id: 7, username: 'student7', password: 'pass123', name: 'Edward Lee', role: 'student', email: 'edward@example.com' },
    { id: 8, username: 'student8', password: 'pass123', name: 'Fiona Chen', role: 'student', email: 'fiona@example.com' },
    { id: 9, username: 'student9', password: 'pass123', name: 'George Martin', role: 'student', email: 'george@example.com' },
    { id: 10, username: 'student10', password: 'pass123', name: 'Helen Davis', role: 'student', email: 'helen@example.com' },
    
    // Teachers
    { id: 11, username: 'teacher1', password: 'pass123', name: 'Prof. Ahmed Zahir', role: 'teacher', email: 'ahmed@example.com' },
    { id: 12, username: 'teacher2', password: 'pass123', name: 'Dr. Sarah Johnson', role: 'teacher', email: 'sarah@example.com' },
    { id: 13, username: 'teacher3', password: 'pass123', name: 'Prof. Michael Chen', role: 'teacher', email: 'michael@example.com' },
    
    // TAs
    { id: 14, username: 'ta1', password: 'pass123', name: 'TA Alex Wong', role: 'ta', email: 'alex@example.com' },
    { id: 15, username: 'ta2', password: 'pass123', name: 'TA Maria Garcia', role: 'ta', email: 'maria@example.com' },
    { id: 16, username: 'ta3', password: 'pass123', name: 'TA David Kim', role: 'ta', email: 'david@example.com' },
    { id: 17, username: 'ta4', password: 'pass123', name: 'TA Lisa Wang', role: 'ta', email: 'lisa@example.com' },
    { id: 18, username: 'ta5', password: 'pass123', name: 'TA Robert Taylor', role: 'ta', email: 'robert@example.com' }
  ]

  // Mock course data
  const mockCourses = [
    { id: 1, name: 'Software Engineering', code: 'YN3012180058', teacherId: 11 },
    { id: 2, name: 'Data Structures', code: 'CS201', teacherId: 12 },
    { id: 3, name: 'Database Systems', code: 'CS301', teacherId: 13 }
  ]

  // Mock marks data
  const mockMarks = [
    // Student 1 marks for Software Engineering
    { id: 1, studentId: 1, courseId: 1, assessment: 'Mid-term Exam', marks: 85, maxMarks: 100, weight: 0.3 },
    { id: 2, studentId: 1, courseId: 1, assessment: 'Presentation', marks: 90, maxMarks: 100, weight: 0.2 },
    { id: 3, studentId: 1, courseId: 1, assessment: 'Classwork', marks: 88, maxMarks: 100, weight: 0.1 },
    { id: 4, studentId: 1, courseId: 1, assessment: 'Final Project', marks: 92, maxMarks: 100, weight: 0.4 },
    
    // Student 2 marks
    { id: 5, studentId: 2, courseId: 1, assessment: 'Mid-term Exam', marks: 78, maxMarks: 100, weight: 0.3 },
    { id: 6, studentId: 2, courseId: 1, assessment: 'Presentation', marks: 85, maxMarks: 100, weight: 0.2 },
    
    // Add more mock data as needed
  ]

  const login = (username, password) => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      user.value = foundUser
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const getStudentMarks = (studentId) => {
    return mockMarks.filter(mark => mark.studentId === studentId)
  }

  const getAllMarks = () => {
    return mockMarks
  }

  const addMark = (markData) => {
    const newId = Math.max(...mockMarks.map(m => m.id)) + 1
    mockMarks.push({ id: newId, ...markData })
    return newId
  }

  const updateMark = (id, updatedData) => {
    const index = mockMarks.findIndex(m => m.id === id)
    if (index !== -1) {
      mockMarks[index] = { ...mockMarks[index], ...updatedData }
      return true
    }
    return false
  }

  const deleteMark = (id) => {
    const index = mockMarks.findIndex(m => m.id === id)
    if (index !== -1) {
      mockMarks.splice(index, 1)
      return true
    }
    return false
  }

  const getCourses = () => {
    return mockCourses
  }

  const getStudents = () => {
    return mockUsers.filter(u => u.role === 'student')
  }

  const getUserById = (id) => {
    return mockUsers.find(u => u.id === id)
  }

  const getCourseById = (id) => {
    return mockCourses.find(c => c.id === id)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    getStudentMarks,
    getAllMarks,
    addMark,
    updateMark,
    deleteMark,
    getCourses,
    getStudents,
    getUserById,
    getCourseById
  }
})