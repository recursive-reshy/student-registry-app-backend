import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

// Types
import { Student } from '../types/index.js'

// DTOs
interface StudentDto {
  name: string
  email: string
}

const save = async ( student: StudentDto ): Promise< MutationResult > => {
  try {
    const { name, email } = student

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

export { 
  save,
  findAll, 
  findByEmail 
}

export type { StudentDto }