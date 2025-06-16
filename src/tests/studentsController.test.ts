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
import { createStudent, registerStudents, getCommonStudents, suspendStudentByEmail, retrieveForNotifications } from '../controllers/students.js'

// Types 
import type { Teacher, Student } from '../types'

describe('createStudent', () => {
  beforeEach( () => {
    jest.clearAllMocks()
  } )

  it( 'should create a new student and return 201 status code', async () => {
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

  let mockFindTeacherByEmail: jest.MockedFunction< typeof teachersRepository.findByEmail >
  let mockFindByEmails: jest.MockedFunction< typeof studentsRepository.findByEmails >
  let mockFindByTeacherIdAndStudentId: jest.MockedFunction< typeof teacherStudentRegistrationRepository.findByTeacherIdAndStudentId >
  let mockSaveTeacherStudentRegistration: jest.MockedFunction< typeof teacherStudentRegistrationRepository.save >

  beforeEach( () => {
    jest.clearAllMocks()
    mockFindTeacherByEmail = jest.mocked( teachersRepository.findByEmail )
    mockFindByEmails = jest.mocked( studentsRepository.findByEmails )
    mockFindByTeacherIdAndStudentId = jest.mocked( teacherStudentRegistrationRepository.findByTeacherIdAndStudentId )
    mockSaveTeacherStudentRegistration = jest.mocked( teacherStudentRegistrationRepository.save )
  } )

  it( 'should return 400 status code if teacher does not exist', async () => {
    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/register',
      body: {
        teacher: 'john.doe@example.com',
        students: [ 'jane.doe@example.com', 'jane.smith@example.com' ]
      }
    } )

    const postResponse = createResponse()

    mockFindTeacherByEmail.mockResolvedValue( { results: [], fields: [] } )

    await registerStudents( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 400 )
    expect( postResponse._getJSONData() ).toEqual( { message: 'Teacher does not exist' } )
  } )

  it( 'should return 400 status code if no students are provided', async () => {

    const mockTeacher: Teacher = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/register',
      body: {
        teacher: 'john.doe@example.com',
        students: []
      }
    } )

    const postResponse = createResponse()

    mockFindTeacherByEmail.mockResolvedValue( { results: [ mockTeacher ], fields: [] } )

    await registerStudents( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 400 )
    expect( postResponse._getJSONData() ).toEqual( { message: 'Students are required' } )
  } )

  it( 'should register students to a teacher and return 204 status code', async () => {

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

describe( 'getCommonStudents', () => {

  let mockFindTeachersByEmails: jest.MockedFunction< typeof teachersRepository.findByEmails >
  let mockFindAllStudentEmailsByTeacherIds: jest.MockedFunction< typeof teacherStudentRegistrationRepository.findAllStudentEmailsByTeacherIds >

  beforeEach( () => {
    jest.clearAllMocks()
    mockFindTeachersByEmails = jest.mocked( teachersRepository.findByEmails )
    mockFindAllStudentEmailsByTeacherIds = jest.mocked( teacherStudentRegistrationRepository.findAllStudentEmailsByTeacherIds )
  } )

  it( 'should return 400 status code if no teacher is provided', async () => { 

    const getRequest = createRequest( {
      method: 'GET',
      url: '/students/commonstudents'
    } )
    
    const getResponse = createResponse()

    await getCommonStudents( getRequest as Request, getResponse as Response, jest.fn() )

    expect( getResponse.statusCode ).toEqual( 400 )
    expect( getResponse._getJSONData() ).toEqual( { message: 'Teacher email is required' } )
  } )

  it( 'should return 400 status code if teacher does not exist', async () => {
    const getRequest = createRequest( {
      method: 'GET',
      url: '/students/commonstudents',
      query: {
        teacher: [ 'john.doe@example.com', 'jane.doe@example.com' ]
      }
    } )

    const getResponse = createResponse()

    mockFindTeachersByEmails.mockResolvedValue( { results: [], fields: [] } )

    await getCommonStudents( getRequest as Request, getResponse as Response, jest.fn() )

    expect( getResponse.statusCode ).toEqual( 400 )
    expect( getResponse._getJSONData() ).toEqual( { error: 'Teachers not found: john.doe@example.com, jane.doe@example.com' } )
  } )

  it( 'should return 200 with common students', async () => {

    const mockTeachers: Teacher[] = [
      { id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { id: '2',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockStudents: Student[] = [
      { id: '1',
        name: 'Luke Skywalker',
        email: 'luke.skywalker@example.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { id: '2',
        name: 'Leia Organa',
        email: 'leia.organa@example.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const getRequest = createRequest( {
      method: 'GET',
      url: '/students/commonstudents',
      query: {
        teacher: [ 'john.doe@example.com', 'jane.doe@example.com' ]
      }
    } )

    const getResponse = createResponse()

    mockFindTeachersByEmails.mockResolvedValue( { results: mockTeachers, fields: [] } )
    mockFindAllStudentEmailsByTeacherIds.mockResolvedValue( { results: mockStudents.map( ( student ) => ( { email: student.email } ) ), fields: [] } )

    await getCommonStudents( getRequest as Request, getResponse as Response, jest.fn() )

    expect( getResponse.statusCode ).toEqual( 200 )
    expect( getResponse._getJSONData() ).toEqual( { students: mockStudents.map( ( student ) => student.email ) } )
  } )
} )

describe( 'suspendStudentByEmail', () => { 

  let mockFindByEmail: jest.MockedFunction< typeof studentsRepository.findByEmail >
  let mockUpdateById: jest.MockedFunction< typeof studentsRepository.updateById >

  beforeEach( () => {
    jest.clearAllMocks()
    mockFindByEmail = jest.mocked( studentsRepository.findByEmail )
    mockUpdateById = jest.mocked( studentsRepository.updateById )
  } )

  it( 'should return 400 status code if no student is provided', async () => { 
    const patchRequest = createRequest( {
      method: 'PATCH',
      url: '/students/suspend',
      body: {
      }
    } )
    
    const patchResponse = createResponse()

    await suspendStudentByEmail( patchRequest as Request, patchResponse as Response, jest.fn() )

    expect( patchResponse.statusCode ).toEqual( 400 )
    expect( patchResponse._getJSONData() ).toEqual( { message: 'Student email is required' } )
  } )

  it( 'should return 400 status code if student does not exist', async () => {
    const patchRequest = createRequest( {
      method: 'PATCH',
      url: '/students/suspend',
      body: {
        student: 'john.doe@example.com'
      }
    } )

    const patchResponse = createResponse()

    mockFindByEmail.mockResolvedValue( { results: [], fields: [] } )

    await suspendStudentByEmail( patchRequest as Request, patchResponse as Response, jest.fn() )

    expect( patchResponse.statusCode ).toEqual( 400 )
    expect( patchResponse._getJSONData() ).toEqual( { message: 'Student does not exist' } )
  } )

  it( 'should suspend a student and return 204 status code', async () => {

    const mockStudent: Student = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const patchRequest = createRequest( {
      method: 'PATCH',
      url: '/students/suspend',
      body: {
        student: 'john.doe@example.com'
      }
    } )

    const patchResponse = createResponse()

    mockFindByEmail.mockResolvedValue( { results: [ mockStudent ], fields: [] } )
    mockUpdateById.mockResolvedValue( { 
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

    await suspendStudentByEmail( patchRequest as Request, patchResponse as Response, jest.fn() )

    expect( patchResponse.statusCode ).toEqual( 204 )
  } )
} )

describe( 'retrieveForNotifications', () => {

  let mockFindTeacherByEmail: jest.MockedFunction< typeof teachersRepository.findByEmail >
  let mockFindAllValidStudentEmailsByTeacherId: jest.MockedFunction< typeof teacherStudentRegistrationRepository.findAllValidStudentEmailsByTeacherId >
  let mockFindByEmails: jest.MockedFunction< typeof studentsRepository.findByEmails >

  beforeEach( () => {
    jest.resetAllMocks()
    mockFindTeacherByEmail = jest.mocked( teachersRepository.findByEmail )
    mockFindAllValidStudentEmailsByTeacherId = jest.mocked( teacherStudentRegistrationRepository.findAllValidStudentEmailsByTeacherId )
    mockFindByEmails = jest.mocked( studentsRepository.findByEmails )
  } )

  it( 'should return 400 status code if no teacher or notification is provided', async () => { 
    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/retrievefornotifications',
      body: {
      }
    } )

    const postResponse = createResponse()

    await retrieveForNotifications( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 400 )
    expect( postResponse._getJSONData() ).toEqual( { message: 'Teacher email and notification are required' } ) 
  } )

  it( 'should return 400 status code if teacher does not exist', async () => {
    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/retrievefornotifications',
      body: {
        teacher: 'john.doe@example.com',
        notification: 'Hello, @jane.doe@example.com'
      }
    } )

    const postResponse = createResponse()

    mockFindTeacherByEmail.mockResolvedValue( { results: [], fields: [] } )

    await retrieveForNotifications( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 400 )
    expect( postResponse._getJSONData() ).toEqual( { message: 'Teacher does not exist' } )
  } )

  it( 'should return 200 with valid recipients', async () => {

    const mockTeacher: Teacher = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockStudentsEmails: Record< string, string >[] = [
      { email: 'luke.skywalker@example.com' },
      { email: 'leia.organa@example.com' }
    ]

    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/retrievefornotifications',
      body: {
        teacher: 'john.doe@example.com',
        notification: 'Hey everybody'
      }
    } )

    const postResponse = createResponse()

    mockFindTeacherByEmail.mockResolvedValue( { results: [ mockTeacher ], fields: [] } )
    mockFindAllValidStudentEmailsByTeacherId.mockResolvedValue( { results: mockStudentsEmails, fields: [] } )

    await retrieveForNotifications( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 200 )
    expect( postResponse._getJSONData() ).toEqual( { recipients: mockStudentsEmails.map( ( student ) => student.email ) } )
  } )

  it( 'should return 200 with valid recipients with mentioned emails', async () => {

    const mockTeacher: Teacher = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockStudentsEmails: Record< string, string >[] = [
      { email: 'luke.skywalker@example.com' },
      { email: 'leia.organa@example.com' }
    ]

    const mockMentionedStudents: Student[] = [
      { id: '1',
        name: 'Han Solo',
        email: 'han.solo@example.com',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const postRequest = createRequest( {
      method: 'POST',
      url: '/students/retrievefornotifications',
      body: {
        teacher: 'john.doe@example.com',
        notification: 'Hey everybody! @han.solo@example.com'
      }
    } )

    const postResponse = createResponse()

    mockFindTeacherByEmail.mockResolvedValue( { results: [ mockTeacher ], fields: [] } )
    mockFindAllValidStudentEmailsByTeacherId.mockResolvedValue( { results: mockStudentsEmails, fields: [] } )
    mockFindByEmails.mockResolvedValue( { results: mockMentionedStudents, fields: [] } )
    
    await retrieveForNotifications( postRequest as Request, postResponse as Response, jest.fn() )

    expect( postResponse.statusCode ).toEqual( 200 )
    expect( postResponse._getJSONData() ).toEqual( { 
      recipients: [ ...mockStudentsEmails.map( ( student ) => student.email ), 'han.solo@example.com' ] 
    } )
  } )
} )