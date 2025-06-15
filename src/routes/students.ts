import { Router } from 'express'

// Controllers
import { 
  createStudent,
  getAllStudents,
  registerStudents,
  getCommonStudents,
  suspendStudentByEmail,
  retrieveForNotifications
} from '../controllers/students.js'

const router = Router()

router.route( '/students' )
  .post( createStudent )
  .get( getAllStudents )

router.route( '/register' ).post( registerStudents )
router.route( '/commonstudents' ).get( getCommonStudents )
router.route( '/suspend' ).patch( suspendStudentByEmail )
router.route( '/retrievefornotifications' ).post( retrieveForNotifications )

export default router