import { Router } from 'express'

// Routes
import teachers from './teachers.js'

const router = Router()

router.use( '/teachers', teachers )

export default router