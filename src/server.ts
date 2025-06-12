import express from 'express'

// Middlewares
import cors from 'cors'

// Database
import connect from './database/connection.js'


// App config
const PORT = process.env.PORT || 5000
const app = express()

// Middlewares
app.use( cors() )
app.use( express.json() )

const start = async () => {
  try {
    console.log( 'Starting server...' )

    // Connect to the database
    await connect()

    app.listen( PORT, () => {
      console.log( `Server is running on port ${ PORT }` )
    } )
  } catch (error) {
    console.error( `Error while starting the server: ${ error }` )
  }
}

start()