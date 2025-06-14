import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

import { TeacherStudentRegistration } from '../types/index.js'

interface CreateTeacherStudentRegistrationDto {
  teacherId: number
  studentId: number
}

const save = async ( { teacherId, studentId }: CreateTeacherStudentRegistrationDto ): Promise< MutationResult > => {
  try {
    const result = await mutation( 'INSERT INTO TeacherStudentRegistration ( teacherId, studentId ) VALUES ( ?, ? )', [ teacherId, studentId ] )

    return result
  } catch ( error ) {
    console.error( `Error while creating teacher student registration in database: ${ error }` )
    throw error
  }
}

const findByTeacherIdAndStudentId = async ( teacherId: number, studentId: number ): Promise< QueryResult< TeacherStudentRegistration > > => {
  try {
    const result = await query( 'SELECT * FROM TeacherStudentRegistration WHERE teacherId = ? AND studentId = ?', [ teacherId, studentId ] )

    return result
  } catch ( error ) {
    console.error( `Error while fetching teacher student registration by teacherId and studentId from database: ${ error }` )
    throw error
  }
}

export { 
  save,
  findByTeacherIdAndStudentId
}

export type { CreateTeacherStudentRegistrationDto } 