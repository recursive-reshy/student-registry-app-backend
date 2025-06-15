import { Router } from 'express'

// Controllers
import { 
  createStudent,
  getAllStudents,
  registerStudents,
  getCommonStudents
} from '../controllers/students.js'

const router = Router()

router.route( '/students' )
  .post( createStudent )
  .get( getAllStudents )

router.route( '/register' ).post( registerStudents )
router.route( '/commonstudents' ).get( getCommonStudents )

export default router