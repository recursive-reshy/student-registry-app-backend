import { Router } from 'express'

// Controllers
import { 
  createStudent,
  getAllStudents,
  registerStudents
} from '../controllers/students.js'

const router = Router()

router.route( '/students' )
  .post( createStudent )
  .get( getAllStudents )

router.route( '/register' )
  .post( registerStudents ) 

export default router