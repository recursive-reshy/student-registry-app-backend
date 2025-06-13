import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

// Repository methods
import { save, findAll, findByEmail } from '../repositories/students.js'

const createStudent = asyncWrapper( async ( req: Request, res: Response ) => {
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

export { 
  createStudent,
  getAllStudents 
}