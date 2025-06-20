import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

import { TeacherStudentRegistration } from '../types/index.js'

interface CreateTeacherStudentRegistrationDto {
  teacherId: string
  studentId: string
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

const findByTeacherIdAndStudentId = async ( teacherId: string, studentId: string ): Promise< QueryResult< TeacherStudentRegistration > > => {
  try {
    const result = await query( 'SELECT * FROM TeacherStudentRegistration WHERE teacherId = ? AND studentId = ?', [ teacherId, studentId ] )

    return result
  } catch ( error ) {
    console.error( `Error while fetching teacher student registration by teacherId and studentId from database: ${ error }` )
    throw error
  }
}

const findAllStudentEmailsByTeacherIds = async ( teacherIds: string[] ): Promise< QueryResult< Record< string, string > > > => {
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

const findAllValidStudentEmailsByTeacherId = async ( teacherId: string ): Promise< QueryResult< Record< string, string > > > => {
  try {
    const result = await query( 
      `SELECT s.email FROM Students AS s
       INNER JOIN TeacherStudentRegistration AS tsr ON s.id = tsr.studentId
       WHERE tsr.teacherId = ? AND s.isSuspended = FALSE
      `,
      [ teacherId ]
    )

    return result
  } catch ( error ) {
    console.error( `Error while fetching all valid student emails by teacherIds from database: ${ error }` )
    throw error
  }
}

export { 
  save,
  findByTeacherIdAndStudentId,
  findAllStudentEmailsByTeacherIds,
  findAllValidStudentEmailsByTeacherId
}

export type { CreateTeacherStudentRegistrationDto } 