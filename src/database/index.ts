import mysql, { Pool } from 'mysql2/promise'

import dbConfig from '../config/database.js'

let DBPool: Pool | null = null

const connect = async () => {
  try {
    console.log( 'Connecting to the database...' )
    DBPool = mysql.createPool( dbConfig )

    // Test the connection
    const connection = await DBPool.getConnection()
    await connection.ping()
    connection.release()
    console.log( 'Database connected successfully' )

    return DBPool
    
  } catch (error) {
    console.error( `Error while connecting to the database: ${ error }` )
    throw new Error( `Error while connecting to the database: ${ error }` )
  }
}

export default connect