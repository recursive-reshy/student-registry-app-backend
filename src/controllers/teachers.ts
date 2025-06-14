import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

// Repository methods
import { save, findAll, findByEmail } from '../repositories/teachers.js'

interface CreateTeacherRequestDto {
  name: string
  email: string
}

const createTeacher = asyncWrapper( async ( req: Request< {}, {}, CreateTeacherRequestDto >, res: Response ) => {
  const { name, email } = req.body

  if( !name || !email ) {
    return res.status( 400 ).json( { error: 'Name ad email is required' } )
  }

  // Check if teacher already exists
  const existingTeacher = await findByEmail( email )
  
  if( existingTeacher.results.length ) {
    return res.status( 400 ).json( { error: 'Teacher already exists' } )
  }

  const { results } = await save( { name, email } )

  console.log( results )

  return res.status( 201 ).json( { message: 'Teacher created successfully', id: results.insertId } )
} )

const getAllTeachers = asyncWrapper( async ( _: Request, res: Response ) => {
  const { results } = await findAll()

  return res.status( 200 ).json( results )
} )

// Delete by email

export { 
  createTeacher,
  getAllTeachers,
}