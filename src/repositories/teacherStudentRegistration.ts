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

const findAllStudentEmailsByTeacherIds = async ( teacherIds: string[] ): Promise< QueryResult< string > > => {
  try {
    // Create placeholders for the query since we do not know the number of emails
    const placeholders = teacherIds.map( () => '?' ).join( ',' )
    const result = await query( 
      `SELECT s.email FROM Students AS s
       INNER JOIN TeacherStudentRegistration AS tsr ON s.id = tsr.studentId
       WHERE tsr.teacherId IN (${ placeholders })
       GROUP BY s.id
       HAVING COUNT(DISTINCT tsr.teacherId) = ?
      `, 
      [ ...teacherIds, teacherIds.length ]
    )

    return result
  } catch ( error ) {
    console.error( `Error while fetching all student emails by teacherIds from database: ${ error }` )
    throw error
  }
}

export { 
  save,
  findByTeacherIdAndStudentId,
  findAllStudentEmailsByTeacherIds
}

export type { CreateTeacherStudentRegistrationDto } 