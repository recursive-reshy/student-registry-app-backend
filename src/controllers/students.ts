import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

// Repository methods
import { save, findAll, findByEmail, findByEmails } from '../repositories/students.js'
import { findByEmail as findTeacherByEmail } from '../repositories/teachers.js'
import { save as saveTeacherStudentRegistration, findByTeacherIdAndStudentId } from '../repositories/teacherStudentRegistration.js'

interface CreateStudentRequestDto {
  name: string
  email: string
}

interface RegisterStudentRequestDto {
  teacher: string
  students: string[]
}

// TODO: Add a helper fucntion to check if email is valid in util folder

const createStudent = asyncWrapper( async ( req: Request< {}, {}, CreateStudentRequestDto >, res: Response ) => {
  const { name, email } = req.body

  if( !name || !email ) {
    return res.status( 400 ).json( { error: 'Name and email are required' } )
  }

  // Check if student already exists
  const existingStudent = await findByEmail( email )
  
  if( existingStudent.results.length ) {
    return res.status( 400 ).json( { error: 'Student already exists' } )
  }

  const { results } = await save( { name, email } )

  return res.status( 201 ).json( { message: 'Student created successfully', id: results.insertId } )
} )

const getAllStudents = asyncWrapper( async ( _: Request, res: Response ) => {
  const { results } = await findAll()

  return res.status( 200 ).json( results )
} )

const registerStudents = asyncWrapper( async ( req: Request< {}, {}, RegisterStudentRequestDto >, res: Response ) => {
  const { teacher, students } = req.body
  
  if( !teacher ) {
    return res.status( 400 ).json( { error: 'Teacher email is required' } )
  }

  const { results: existingTeacher } = await findTeacherByEmail( teacher )

  if( !existingTeacher.length ) {
    return res.status( 400 ).json( { error: 'Teacher does not exist' } )
  }

  if( !Array.isArray( students ) || !students.length ) {
    return res.status( 400 ).json( { error: 'Students are required' } )
  }

  // TODO: Should check for duplicates. Maybe use set to check for duplicates

  // Check if all students exists
  const { results: existingStudents } = await findByEmails( students )

  if( existingStudents.length != students.length ) {
    const nonExistingStudents = students.filter( ( studentEmail ) => !existingStudents.some( ( { email } ) => email == studentEmail ) )
    return res.status( 400 ).json( { error: `Students not found: ${ nonExistingStudents.join( ', ' ) }` } )
  }

  for( const student of existingStudents ) {
    // Check if student is already registered to the teacher
    const existingRegistration = await findByTeacherIdAndStudentId( existingTeacher[ 0 ].id, student.id )

    if( !existingRegistration.results.length ) {
      await saveTeacherStudentRegistration( { teacherId: existingTeacher[ 0 ].id, studentId: student.id } )
    }
  }

  return res.status( 204 )
} )

export { 
  createStudent,
  getAllStudents,
  registerStudents
}