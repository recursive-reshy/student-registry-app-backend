import { Router } from 'express'

// Controllers
import { createStudent, getAllStudents } from '../controllers/students.js'

const router = Router()

router.route( '/' )
  .post( createStudent )
  .get( getAllStudents )

export default router