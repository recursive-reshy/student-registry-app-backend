import { query, mutation, MutationResult, QueryResult } from '../database/index.js'

// Types
import { Teacher } from '../types/index.js'

// DTOs
interface TeacherDto {
  name: string
  email: string
}

const save = async ( teacherDto: TeacherDto ): Promise< MutationResult > => {
  try {
    const { name, email } = teacherDto

    const result = await mutation( 'INSERT INTO Teachers (name, email) VALUES (?, ?)', [ name, email ] )
  
    return result 
  } catch (error) {
    console.error( `Error while inserting teacher into database: ${ error }` )
    throw error
  }
}

const findAll = async (): Promise< QueryResult< Teacher > > => {
  try {
    const result = await query( 'SELECT * FROM Teachers' )

    return result 
  } catch (error) {
    console.error( `Error while fetching teachers from database: ${ error }` )
    throw error
  }
}

const findByEmail = async ( email: string ): Promise< QueryResult< Teacher > > => {
  try {
    const result = await query( 'SELECT * FROM Teachers WHERE email = ?', [ email ] )

    return result 
  } catch (error) {
    console.error( `Error while fetching teacher by email from database: ${ error }` )
    throw error
  }
}

export { 
  save,
  findAll,
  findByEmail 
}

export type { TeacherDto }