import { Router } from 'express'

// Routes
import teachers from './teachers.js'
import students from './students.js'

const router = Router()

router.use( '/teachers', teachers )
router.use( '/students', students )

export default router