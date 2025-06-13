import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import mysql, { Pool, RowDataPacket, FieldPacket } from 'mysql2/promise'

import dbConfig from '../config/database.js'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

export interface QueryResult< T > {
  results: T[]
  fields: FieldPacket[]
}

let DBPool: Pool | null = null
let connectionStatus: ConnectionStatus = 'disconnected'

// Function to execute SQL queries
// TODO: Check what RowDataPacket is
const query = async < T extends RowDataPacket > ( 
  sql: string,
  params: any [] = []
): Promise< QueryResult< T[0] > > => {
  try {
    console.log( `Executing query: ${ sql }` )
    if( !DBPool || connectionStatus != 'connected' ) {
      throw new Error( 'Error while querying the database: Database is not connected' )
    }

    const [ results, fields ] = await DBPool.execute< T[] >( sql, params )

    return { results, fields }
  } catch ( error ) {
    console.error( `Error while querying the database: ${ error }` )
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
    console.log( 'Reading schema file...', path.join( path.dirname( fileURLToPath( import.meta.url ) ), 'schema', 'tables.sql' ) )
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
        await query( statement )
      }
    }
  } catch ( error) { 
    console.error( `Error while initializing the schema: ${ error }` )
    throw error
  }
}

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

    return DBPool
  } catch ( error ) {
    console.error( `Error while connecting to the database: ${ error }` )
    connectionStatus = 'error'
    throw new Error( `Error while connecting to the database: ${ error }` )
  }
}

export default connect

export { query }