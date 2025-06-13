import { Router } from 'express'

// Controllers
import { createTeacher, getAllTeachers } from '../controllers/teachers.js'

const router = Router()

router.route( '/' )
  .post( createTeacher )
  .get( getAllTeachers )

export default router