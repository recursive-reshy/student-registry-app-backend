import { Request, Response, NextFunction } from 'express'
import { createRequest, createResponse } from 'node-mocks-http'
import { jest } from '@jest/globals'

// Mock repositories
jest.mock( '../repositories/students.js' )
jest.mock( '../repositories/teachers.js' )
jest.mock( '../repositories/teacherStudentRegistration.js' )

// Repository
import * as studentsRepository from '../repositories/students.js'
import * as teachersRepository from '../repositories/teachers.js'
import * as teacherStudentRegistrationRepository from '../repositories/teacherStudentRegistration.js'
// Controller
import { createStudent, registerStudents } from '../controllers/students.js'

// Types 
import type { Teacher, Student } from '../types'

describe('createStudent', () => {
  beforeEach( () => {
    jest.clearAllMocks()
  } )

  test( 'should create a new student and return 201 status code', async () => {
    const postRequest = createRequest( { 
      method: 'POST',
      url: '/students',
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      }
    } )

    const postResponse = createResponse()

    const mockFindByEmail = jest.mocked( studentsRepository.findByEmail )
    const mockSave = jest.mocked( studentsRepository.save )

    mockFindByEmail.mockResolvedValue( { results: [], fields: [] } )
    mockSave.mockResolvedValue( { 
      results: {
        constructor: {
          name: 'ResultSetHeader'
        },
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      }, 
      fields: [] 
    } )

    await createStudent( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse._getJSONData() ).toEqual( { message: 'Student created successfully', id: 0 } )
  } )
} )

describe( 'registerStudents', () => {
  beforeEach( () => {
    jest.clearAllMocks()
  } )

  test( 'should register students to a teacher and return 204 status code', async () => {

    const mockTeacher: Teacher = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockStudents: Student[] = [
      { id: '1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    ]

    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/register',  
      body: {
        teacher: 'john.doe@example.com',
        students: ['jane.doe@example.com', 'jane.smith@example.com']
      }
    } )

    const postResponse = createResponse()

    const mockFindTeacherByEmail = jest.mocked( teachersRepository.findByEmail )
    const mockFindByEmails = jest.mocked( studentsRepository.findByEmails )
    const mockFindByTeacherIdAndStudentId = jest.mocked( teacherStudentRegistrationRepository.findByTeacherIdAndStudentId )
    const mockSaveTeacherStudentRegistration = jest.mocked( teacherStudentRegistrationRepository.save )

    mockFindTeacherByEmail.mockResolvedValue( { results: [ mockTeacher ], fields: [] } )
    mockFindByEmails.mockResolvedValue( { results: mockStudents, fields: [] } )
    mockFindByTeacherIdAndStudentId.mockResolvedValue( { results: [], fields: [] } )
    mockSaveTeacherStudentRegistration.mockResolvedValue( { 
      results: {
        constructor: {
          name: 'ResultSetHeader'
        },
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      },
      fields: [] 
    } )

    await registerStudents( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 204 )

  } )
} )