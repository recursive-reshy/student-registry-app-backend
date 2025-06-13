import { Router } from 'express'

// Routes
import teachers from './teachers.js'
import students from './students.js'

const router = Router()

// For development purposes
router.use( '/teachers', teachers )
// For assessment APIs
router.use( '/', students )

export default router