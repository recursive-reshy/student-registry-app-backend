# Student Registry App Backend

An Express NodeJS backend for managing teachers, students, and their relationships, including:
- Registration
- Suspension
- Notification. 

Built with TypeScript and MySQL.

## Features

- Register students to teachers
- Suspend students
- Retrieve common students among teachers
- Notification system to determine eligible student recipients
- RESTful API design
- MySQL database with auto schema and seed support
- TypeScript for type safety
- Security best practices with Helmet and CORS

## Tech Stack

- Node.js, Express
- TypeScript
- MySQL (with `mysql2`)
- dotenv for environment configuration
- Helmet, CORS for security
- Nodemon, tsx for development

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/recursive-reshy/student-registry-app-backend.git
   cd student-registry-app-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory with the following variables:
   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=student_registry
   PORT=5000
   # Optional: set to true to enable seeding of database
   MYSQL_SEED_DATA=true
   ```

4. **Set up the database:**

   - Create a database in MySQL matching `MYSQL_DATABASE`.
   - The app will auto-create tables and (optionally) seed data on first run.

### Running the Server

- **Development mode (with hot reload):**
  ```bash
  npm run dev
  ```

- **Production build:**
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

### Health Check

- `GET /health`  
  Returns `200 OK` if the server is running.

### Teachers

- `POST /api/teachers`  
  Create a new teacher.  
  **Body:** `{ "name": "Teacher Name", "email": "teacher@email.com" }`

- `GET /api/teachers`  
  List all teachers.

### Students

- `POST /api/students`  
  Create a new student.  
  **Body:** `{ "name": "Student Name", "email": "student@email.com" }`

- `GET /api/students`  
  List all students.

- `POST /api/register`  
  Register students to a teacher.  
  **Body:**  
  ```json
  {
    "teacher": "teacher@email.com",
    "students": ["student1@email.com", "student2@email.com"]
  }
  ```

- `GET /api/commonstudents?teacher=teacher1@email.com&teacher=teacher2@email.com`  
  Get students common to one or more teachers.

- `PATCH /api/suspend`  
  Suspend a student.  
  **Body:** `{ "student": "student@email.com" }`

- `POST /api/retrievefornotifications`  
  Get students eligible to receive a notification from a teacher.  
  **Body:**  
  ```json
  {
    "teacher": "teacher@email.com",
    "notification": "Hello students! @student1@email.com @student2@email.com"
  }
  ```

## Database

- **Schema:** See [`src/database/schema/tables.sql`](src/database/schema/tables.sql)
- **Seed Data:** See [`src/database/schema/seedData.sql`](src/database/schema/seedData.sql)
- Tables: `Teachers`, `Students`, `TeacherStudentRegistration`

## Development

- TypeScript config: [`tsconfig.json`](tsconfig.json)
- Nodemon config: [`nodemon.json`](nodemon.json)
- Source code: [`src/`](src/)

## License

ISC

---

Let me know if you want to add usage examples, diagrams, or further details!