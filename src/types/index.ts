// Models
interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

interface Teacher extends BaseEntity {
  name: string
  email: string
}

interface Student extends BaseEntity {
  name: string
  email: string
  isSuspended: boolean
}

interface TeacherStudentRegistration extends BaseEntity {
  teacherId: number
  studentId: number
}

export type {
  Teacher,
  Student,
  TeacherStudentRegistration
}
