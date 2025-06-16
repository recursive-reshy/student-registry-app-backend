import { Request, Response } from 'express'

import asyncWrapper from '../middleware/asyncWrapper.js'

import { getMentionedEmails } from '../utils.js'

// Repository methods
import { save, findAll, findByEmail, findByEmails, updateById } from '../repositories/students.js'
import { 
  findByEmail as findTeacherByEmail,
  findByEmails as findTeachersByEmails 
} from '../repositories/teachers.js'
import { 
  save as saveTeacherStudentRegistration,
  findByTeacherIdAndStudentId,
  findAllStudentEmailsByTeacherIds,
  findAllValidStudentEmailsByTeacherId
} from '../repositories/teacherStudentRegistration.js'

interface CreateStudentRequestDto {
  name: string
  email: string
}

interface RegisterStudentRequestDto {
  teacher: string
  students: string[]
}

interface RetrieveForNotificationsRequestDto {
  teacher: string
  notification: string
}

const createStudent = asyncWrapper( async ( req: Request< {}, {}, CreateStudentRequestDto >, res: Response ) => {
  const { name, email } = req.body

  if( !name || !email ) {
    return res.status( 400 ).json( { message: 'Name and email are required' } )
  }

  // Check if student already exists
  const existingStudent = await findByEmail( email )
  
  if( existingStudent.results.length ) {
    return res.status( 400 ).json( { message: 'Student already exists' } )
  }

  const { results } = await save( { name, email } )

  return res.status( 201 ).json( { message: 'Student created successfully', id: results.insertId } )
} )

const getAllStudents = asyncWrapper( async ( _: Request, res: Response ) => {
  const { results } = await findAll()

  return res.status( 200 ).json( results )
} )

//Register students to a teacher
const registerStudents = asyncWrapper( async ( req: Request< {}, {}, RegisterStudentRequestDto >, res: Response ) => {
  const { teacher, students } = req.body
  
  if( !teacher ) {
    return res.status( 400 ).json( { message: 'Teacher email is required' } )
  }

  const { results: existingTeacher } = await findTeacherByEmail( teacher )

  if( !existingTeacher.length ) {
    return res.status( 400 ).json( { message: 'Teacher does not exist' } )
  }

  if( !Array.isArray( students ) || !students.length ) {
    return res.status( 400 ).json( { message: 'Students are required' } )
  }

  // Remove duplicates and check if all students exists
  const { results: existingStudents } = await findByEmails( [ ...new Set( students ) ] )

  if( existingStudents.length != students.length ) {
    const nonExistingStudents = students.filter( ( studentEmail ) => !existingStudents.some( ( { email } ) => email == studentEmail ) )
    return res.status( 400 ).json( { message: `Students not found: ${ nonExistingStudents.join( ', ' ) }` } )
  }

  for( const student of existingStudents ) {
    // Check if student is already registered to the teacher
    const existingRegistration = await findByTeacherIdAndStudentId( existingTeacher[ 0 ].id, student.id )

    if( !existingRegistration.results.length ) {
      await saveTeacherStudentRegistration( { teacherId: existingTeacher[ 0 ].id, studentId: student.id } )
    }
  }

  return res.status( 204 ).send()
} )

// Get common students of registered to a teacher or teachers
const getCommonStudents = asyncWrapper( async ( req: Request< {}, {}, {}, { teacher: string | string [] } >, res: Response ) => {
  const { teacher } = req.query

  if( !teacher ) {
    return res.status( 400 ).json( { message: 'Teacher email is required' } )
  }

  // Handle both single teacher and multiple teachers
  const teacherEmails = Array.isArray( teacher ) ? teacher : [ teacher ]

  if( !teacherEmails.length ) {
    return res.status( 400 ).json( { error: 'Teacher email is required' } )
  }

  const { results: existingTeachers } = await findTeachersByEmails( teacherEmails )

  if( existingTeachers.length != teacherEmails.length ) {
    const nonExistingTeachers = teacherEmails.filter( ( teacherEmail ) => !existingTeachers.some( ( { email } ) => email == teacherEmail ) )
    return res.status( 400 ).json( { error: `Teachers not found: ${ nonExistingTeachers.join( ', ' ) }` } )
  }

  const { results: commonStudentEmails } = await findAllStudentEmailsByTeacherIds( existingTeachers.map( ( { id } ) => id ) ) 

  return res.status( 200 ).json( { students: commonStudentEmails.map( ( { email } ) => email ) } )
} )

const suspendStudentByEmail = asyncWrapper( async ( req: Request< {}, {}, { student: string } >, res: Response ) => {
  const { student } = req.body

  if( !student ) {
    return res.status( 400 ).json( { error: 'Student email is required' } )
  }

  const { results: existingStudent } = await findByEmail( student )

  if( !existingStudent.length ) {
    return res.status( 400 ).json( { error: 'Student does not exist' } )
  }

  await updateById( existingStudent[ 0 ].id, { isSuspended: true } )

  return res.status( 204 ).send()
} )

// Get all students that can receive a notification from a teacher
const retrieveForNotifications = asyncWrapper( async ( req: Request< {}, {}, RetrieveForNotificationsRequestDto >, res: Response ) => {
  const { teacher, notification } = req.body

  if( !teacher || !notification ) {
    return res.status( 400 ).json( { message: 'Teacher email and notification are required' } )
  }

  const { results: existingTeacher } = await findTeacherByEmail( teacher )

  if( !existingTeacher.length ) {
    return res.status( 400 ).json( { message: 'Teacher does not exist' } )
  }

  const { results: registeredStudentEmails } = await findAllValidStudentEmailsByTeacherId( existingTeacher[ 0 ].id )

  const allRecipients = [ ...registeredStudentEmails.map( ( { email } ) => email ) ]

  if( notification.includes( '@' ) ) {
    const mentionedEmails = getMentionedEmails( notification )
    const { results: mentionedStudents } = await findByEmails( mentionedEmails )
    allRecipients.push( ...mentionedStudents.filter( ( { isSuspended } ) => !isSuspended ).map( ( { email } ) => email ) )
  }

  // Remove duplicates
  const recipients = [ ...new Set( allRecipients ) ]

  return res.status( 200 ).json( recipients )
} )

export { 
  createStudent,
  getAllStudents,
  registerStudents,
  getCommonStudents,
  suspendStudentByEmail,
  retrieveForNotifications
}