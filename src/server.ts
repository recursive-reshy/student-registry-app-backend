import 'dotenv/config'
import express, { Request, Response } from 'express'

// Middlewares
import cors from 'cors'
import helmet from 'helmet'

// Database
import connect from './database/index.js'

// Routes
import router from './routes/index.js'

// App config
const PORT = process.env.PORT || 5000
const app = express()

// Middlewares
app.use( cors() ) // Cross-Origin Resource Sharing
app.use( helmet() ) // Security headers
app.use( express.json() )

//Health check
app.get( '/health', ( _: Request, res: Response ) => {
  res.status( 200 ).send( 'Health check' )
} )

// Routes
app.use( '/api', router )

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