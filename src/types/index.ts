// Models
interface BaseEntity {
  id: string
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
  teacherId: string
  studentId: string
}

export type {
  Teacher,
  Student,
  TeacherStudentRegistration
}
