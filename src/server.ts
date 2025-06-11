import express from 'express'

import cors from 'cors'

// App config
const PORT = process.env.PORT || 5000
const app = express()

// Middlewares
app.use( cors() )
app.use( express.json() )

const start = async () => {
  try {
    console.log( 'Starting server...' )
    app.listen( PORT, () => {
      console.log( `Server is running on port ${ PORT }` )
    } )
  } catch (error) {
    console.error( `Error starting the server: ${ error }` )
  }
}

start()