import { Router } from 'express'

// Controllers
import { createTeacher, getAllTeachers, getTeacherByAttribute } from '../controllers/teachers.js'

const router = Router()

router.route( '/' )
  .post( createTeacher )
  .get( getAllTeachers )

router.route( '/search' )
  .get( getTeacherByAttribute )

export default router