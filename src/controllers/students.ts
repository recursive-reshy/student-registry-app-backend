import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

// Repository methods
import { save, findAll, findByEmail } from '../repositories/students.js'
import { findByEmail as findTeacherByEmail } from '../repositories/teachers.js'

interface CreateStudentRequestDto {
  name: string
  email: string
}

interface RegisterStudentRequestDto {
  teacher: string
  students: string[]
}

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

  const existingTeacher = await findTeacherByEmail( teacher )

  if( !existingTeacher.results.length ) {
    return res.status( 400 ).json( { error: 'Teacher does not exist' } )
  }


  if( !Array.isArray( students ) || !students.length ) {
    return res.status( 400 ).json( { error: 'Students are required' } )
  }

  return res.status( 200 ).json( { message: 'Students registered successfully' } )
} )

export { 
  createStudent,
  getAllStudents,
  registerStudents
}