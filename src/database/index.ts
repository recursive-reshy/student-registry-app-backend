import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import mysql, { Pool, RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2/promise'

import dbConfig from '../config/database.js'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

interface MutationResult {
  results: ResultSetHeader
  fields: FieldPacket[]
}

interface QueryResult< T > {
  results: T[]
  fields: FieldPacket[]
}

let DBPool: Pool | null = null
let connectionStatus: ConnectionStatus = 'disconnected'

// Querying Database
const query = async < T extends RowDataPacket > ( 
  sql: string,
  params: any[] = []
): Promise< QueryResult< T[ 0 ] > > => {
  try {
    console.log( `Executing query: ${ sql }` )
    if( !DBPool || connectionStatus != 'connected' ) {
      throw new Error( 'Error while querying the database: Database is not connected' )
    }

    const [ results, fields ] = await DBPool.execute< T[] >( sql, params )

    console.log( 'Query executed successfully' )
    
    return { results, fields }
  } catch ( error ) {
    console.error( `Error while querying the database: ${ error }` )
    throw error
  }
}

// Mutating Database: Insert, Update, Delete
const mutation = async (
  sql: string,
  params: any[] = []
): Promise< MutationResult > => {
  try {
    console.log( `Executing mutation: ${ sql }` )
    if( !DBPool || connectionStatus != 'connected' ) {
      throw new Error( 'Error while mutating the database: Database is not connected' )
    }

    const [ results, fields ] = await DBPool.execute< ResultSetHeader >( sql, params )

    console.log( 'Mutation executed successfully' )

    return { results, fields }
  } catch (error) {
    console.error( `Error while querying the database: ${ error }` )
    throw error
  }
}

// Seed data to database
const seedData = async (): Promise< void > => {
  try {
    console.log( 'Seeding data into database...' )
    if( connectionStatus != 'connected' ) {
      throw new Error( 'Error while seeding data into database: Database is not connected' )
    }

    console.log( 'Checking if there is data in the database...' )
    // Get all tables in database with their row count
    const tables = await query( 
      `
        SELECT 'teachers' as table_name, COUNT(*) as row_count FROM teachers
        UNION ALL
        SELECT 'students', COUNT(*) FROM students  
        UNION ALL
        SELECT 'teacherstudentregistration', COUNT(*) FROM teacherstudentregistration
        ORDER BY table_name
      `
    )

    if( tables.results.some( ( { row_count } ) => row_count > 0 ) ) {
      console.log( 'Database already has data, skipping seeding...' )
      return
    }

    console.log( 'Database is empty, seeding data...' )
    
    // Read seed data file
    console.log( 'Reading seed data file...' )
    const seedData = await fs.readFile(
      path.join(
        path.dirname( fileURLToPath( import.meta.url ) ),
        'schema',
        'seedData.sql'
      ),
      'utf8'
    )

    // Split seed data into individual queries
    const statements = seedData.split( ';' )
    
    // Execute each statement
    for( const statement of statements ) {
      if( statement.trim() ) {
        await mutation( statement )
      }
    }
  } catch ( error ) {
    console.error( `Error while seeding data into database: ${ error }` )
    throw error
  }
}

// Function to initialize the schema
const initSchema = async (): Promise< void > => {
  try {
    console.log( 'Initializing the schema...' )
    if( connectionStatus != 'connected' ) {
      throw new Error( 'Error while initializing the schema: Database is not connected' )
    }

    // Read schema file
    console.log( 'Reading schema file...' )
    const schema = await fs.readFile(
      path.join( 
        path.dirname( fileURLToPath( import.meta.url ) ),
        'schema',
        'tables.sql'
      ),
      'utf8'
    )

    // Split schema into individual queries
    const statements = schema.split( ';' )

    // Execute each statement
    for( const statement of statements ) {
      // Trim the statement to remove any whitespace and ensure it's not empty
      if( statement.trim() ) {
        await mutation( statement )
      }
    }
  } catch ( error) { 
    console.error( `Error while initializing the schema: ${ error }` )
    throw error
  }
}

// Connect to the database
const connect = async () => {
  if( DBPool && connectionStatus == 'connected' ) {
    console.log( 'Database already connected' )
    return DBPool
  }

  try {
    console.log( 'Connecting to the database...' )
    DBPool = mysql.createPool( dbConfig )

    // Test the connection
    const connection = await DBPool.getConnection()
    await connection.ping()
    connection.release()
    connectionStatus = 'connected'
    console.log( 'Database connected successfully' )

    // Initialize the schema
    // TODO: Check if the schema is already initialized ( how to do this? )
    await initSchema()

    // Seed data
    if( process.env.MYSQL_SEED_DATA ) {
      await seedData()
    }

    return DBPool
  } catch ( error ) {
    console.error( `Error while connecting to the database: ${ error }` )
    connectionStatus = 'error'
    throw new Error( `Error while connecting to the database: ${ error }` )
  }
}

export default connect

export { query, mutation }

export type { QueryResult, MutationResult }