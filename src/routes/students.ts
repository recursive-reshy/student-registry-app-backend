import { Router } from 'express'

// Controllers
import { createStudent, getAllStudents } from '../controllers/students.js'

const router = Router()

router.route( '/students' )
  .post( createStudent )
  .get( getAllStudents )

export default router