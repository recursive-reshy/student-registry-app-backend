import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

import { query } from '../database/index.js'


// Create
const createTeacher = asyncWrapper( async ( req: Request, res: Response ) => {
  const { name, email } = req.body

  if( !name || !email ) {
    return res.status( 400 ).json( { error: 'Name ad email is required' } )
  }

  // TODO: Check if teacher already exists
  const existingTeacher = await query( 'SELECT * FROM Teachers WHERE email = ?', [ email ] )
  
  if( existingTeacher.results.length ) {
    return res.status( 400 ).json( { error: 'Teacher already exists' } )
  }

  // Insert teacher
  const { results } = await query( 'INSERT INTO Teachers (name, email) VALUES (?, ?)', [ name, email ] )

  console.log( results )

  return res.status( 201 ).json( { message: 'Teacher created successfully' } )
} )


// Get all teachers
const getAllTeachers = asyncWrapper( async ( _: Request, res: Response ) => {
  const { results } = await query( 'SELECT * FROM Teachers' )

  return res.status( 200 ).json( results )
} )

// Currently only email is supported
// TODO: Add support for other attributes
const getTeacherByAttribute = asyncWrapper( async ( req: Request, res: Response ) => {
  const { email } = req.query

  if( !email ) {
    return res.status( 400 ).json( { error: 'Email is required' } )
  }

  const { results } = await query( 'SELECT * FROM Teachers WHERE email = ?', [ email ] )

  console.log( results, email )

  if( !results.length ) {
    return res.status( 404 ).json( { error: 'Teacher not found' } )
  }

  return res.status( 200 ).json( results[ 0 ] )
} )


// Update by email

// Delete by email

export { 
  createTeacher,
  getAllTeachers,
  getTeacherByAttribute
}