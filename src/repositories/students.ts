import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

// Types
import { Student } from '../types/index.js'

// DTOs
interface CreateStudentDto {
  name: string
  email: string
}

type UpdateStudentDto = Partial< Omit< Student, 'id' | 'createdAt' | 'updatedAt' > >

const save = async ( studentDto: CreateStudentDto ): Promise< MutationResult > => {
  try {
    const { name, email } = studentDto

    const result = await mutation( 'INSERT INTO Students (name, email) VALUES (?, ?)', [ name, email ] )

    return result
  } catch (error) {
    console.error( `Error while inserting student into database: ${ error }` )
    throw error
  }
}

const findAll = async (): Promise< QueryResult< Student > > => {
  try {
    const result = await query( 'SELECT * FROM Students' )

    return result
  } catch (error) {
    console.error( `Error while fetching students from database: ${ error }` )
    throw error
  }
}

const findByEmail = async ( email: string ): Promise< QueryResult< Student > > => {
  try {
    const result = await query( 'SELECT * FROM Students WHERE email = ?', [ email ] )

    return result
  } catch (error) {
    console.error( `Error while fetching student by email from database: ${ error }` )
    throw error
  }
}

const findByEmails = async ( emails: string[] ): Promise< QueryResult< Student > > => {
  try {
    // Create placeholders for the query since we do not know the number of emails
    const placeholders = emails.map( () => '?' ).join( ',' )
    const result = await query( `SELECT * FROM Students WHERE email IN (${ placeholders })`, emails )

    return result
  } catch (error) {
    console.error( `Error while fetching students by emails from database: ${ error }` )
    throw error
  }
}

const updateById = async ( id: number, updates: UpdateStudentDto ): Promise< MutationResult > => {
  try {
    // Build dynamic query
    const setClause = Object.keys( updates ).map( ( key ) => `${ key } = ?` ).join( ', ' )
    
    const result = await mutation( `UPDATE Students SET ${ setClause } WHERE id = ?`, [ ...Object.values( updates ), id ] )

    return result
  } catch( error ) {
    console.error( `Error while updating student by id from database: ${ error }` )
    throw error
  }
}

export { 
  save,
  findAll, 
  findByEmail,
  findByEmails,
  updateById
}

export type { CreateStudentDto }