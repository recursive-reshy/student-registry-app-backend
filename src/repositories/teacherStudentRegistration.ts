import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

import { TeacherStudentRegistration } from '../types/index.js'

interface TeacherStudentRegistrationDto {
  teacherId: number
  studentId: number
}

