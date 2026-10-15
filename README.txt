# PeopleDesk – Employee Management System

A web-based Employee Management System developed as part of the Kloudspot Software Engineer / Backend Technical Assessment. PeopleDesk enables administrators to manage employee records through a responsive user interface backed by REST APIs and a relational database.

## 1. Project Overview

PeopleDesk is designed to simplify employee record management. Administrators can add, view, update, delete, search, and filter employee information through a centralized dashboard.

The application follows a frontend-backend architecture, with React providing the user interface and Spring Boot exposing REST APIs for employee operations.

## 2. Features

### Employee Management
- Add new employee records.
- View employee details.
- Update existing employee information.
- Delete employees with confirmation.
- Display all employee records.

### Employee Directory
- Search employees by name or email.
- Filter employees by department.
- Filter employees by employment status.
- Paginate employee records.
- Display serial numbers in the employee table.
- Refresh employee data.

### Dashboard
- Display total employee count.
- Display active employee count.
- Display inactive employee count.
- Provide a centralized employee directory.

### CSV Export
- Export employee information to CSV.
- Export records matching the current search and filters.
- Include employee ID, name, email, phone number, department, designation, joining date, salary, and employment status.

### Employee Details and Validation
- View complete employee information.
- Validate required fields.
- Validate email address format.
- Validate phone number format.
- Prevent duplicate email addresses and phone numbers in the frontend.

> Note: Frontend validation improves usability. Duplicate prevention should also be enforced by the backend and database to ensure data integrity.

## 3. Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios


### Backend
- Java 17 or later
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- Hibernate

### Database
- PostgreSQL

### Testing and Documentation
- JUnit 5
- Mockito
- Swagger/OpenAPI
- Postman
- Git and GitHub

### Optional Enhancements
- Docker
- Docker Compose

Only consider the optional tools implemented in the submitted project as completed features.

## 4. Prerequisites

Install the following software before running the application:

- Java 17 or later
- Node.js and npm
- PostgreSQL
- Git
- Maven, or the Maven Wrapper included in the backend project
- A modern web browser

Optional:
- Docker Desktop with Docker Compose, if the Docker setup is included.

Verify your installations:

```bash
java -version
node --version
npm --version
git --version
docker --version
docker compose version
```

The Docker commands are required only when using Docker.

## 5. Database Configuration and Setup

### Step 1: Start PostgreSQL

Ensure that PostgreSQL is installed and running.

### Step 2: Create the Database

Open PostgreSQL using pgAdmin or `psql` and execute:

```sql
CREATE DATABASE employee_management;
```

Use a database name consistent with the application's configuration.

### Step 3: Configure the Backend

Open the backend configuration file:

`backend/src/main/resources/application.properties`

Configure the datasource using your local PostgreSQL credentials.

Example:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/kloudstaff}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

The example assumes the PostgreSQL JDBC driver is configured in `pom.xml`.

Set the `DB_PASSWORD` environment variable to your local PostgreSQL password before starting the backend. Do not commit actual passwords to GitHub.

If the project already has working database configuration, retain the existing configuration and adapt these instructions accordingly.

### Step 4: Database Schema

The employee table should store the following information:

- Employee ID
- Full Name
- Email Address
- Phone Number
- Department
- Designation
- Date of Joining
- Salary
- Employment Status

The application should persist employee records in PostgreSQL.

## 6. How to Run the Backend

### Step 1: Open the Project

Navigate to the backend directory:

```bash
cd backend
```

### Step 2: Run the Application

On Windows, use the Maven Wrapper if it is available:

```powershell
.\mvnw.cmd spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

### Step 3: Verify the Backend

The backend should start on:

`http://localhost:8080`

Check the console logs for startup errors. Ensure PostgreSQL is running and the database connection succeeds.

## 7. How to Run the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

Ensure the frontend API configuration or Vite proxy points to the running Spring Boot backend.

## 8. REST API Endpoints and Sample Requests

The following endpoints illustrate the expected employee API operations. Confirm the paths and request fields against the actual Spring Boot controller before submission.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Retrieve employees |
| GET | `/api/employees/{id}` | Retrieve an employee by ID |
| POST | `/api/employees` | Create an employee |
| PUT | `/api/employees/{id}` | Update an employee |
| DELETE | `/api/employees/{id}` | Delete an employee |

### Sample Request: Create Employee

**POST** `/api/employees`

Content-Type: `application/json`

```json
{
  "fullName": "Suresh Nair",
  "email": "suresh.nair@example.com",
  "phoneNumber": "9876543210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "dateOfJoining": "2025-11-15",
  "salary": 45000,
  "employmentStatus": "ACTIVE"
}
```

### Sample Request: Update Employee

**PUT** `/api/employees/1`

```json
{
  "fullName": "Suresh Nair",
  "email": "suresh.nair@example.com",
  "phoneNumber": "9876543210",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "dateOfJoining": "2025-11-15",
  "salary": 55000,
  "employmentStatus": "ACTIVE"
}
```

### Sample Request: Retrieve Employees

**GET**

`http://localhost:8080/api/employees`

If pagination is supported by the backend, use the parameters expected by your controller, for example:

`http://localhost:8080/api/employees?page=0&size=10`

### Sample Request: Delete Employee

**DELETE**

`http://localhost:8080/api/employees/1`

The example ID must correspond to an existing employee record.

### Swagger/OpenAPI Documentation

If Swagger/OpenAPI is configured, access the interactive documentation at:

`http://localhost:8080/swagger-ui/index.html`

Use the documentation to explore available endpoints and test API requests.

## 9. How to Execute Unit Tests

Navigate to the backend directory:

```bash
cd backend
```

Run all tests using the Maven Wrapper on Windows:

```powershell
.\mvnw.cmd test
```

Or use Maven:

```bash
mvn test
```

Service-layer tests should cover business logic such as:

- Creating an employee.
- Retrieving an employee.
- Updating an employee.
- Deleting an employee.
- Handling employee records that do not exist.
- Validating relevant business rules.

Use JUnit 5 for test cases and Mockito to mock repository dependencies where appropriate.

Ensure all tests pass before submitting the project. Document only tests that have actually been implemented and executed.

## 10. Docker Compose Instructions (Optional)

If Docker Compose has been implemented, the project can be configured to run the frontend, backend, and PostgreSQL database as services.

From the project root directory, run:

```bash
docker compose up --build
```

To stop the services:

```bash
docker compose down
```

To stop the services without deleting the database volume, use the command above without the `-v` option.

Ensure that:
- The backend connects to the database using the Compose service name.
- The frontend can communicate with the backend.
- Database credentials are configured appropriately.
- Persistent storage is configured for PostgreSQL.
- The Docker Compose configuration matches the actual project structure.

If Docker Compose has not been implemented, omit these instructions from the final submission or clearly mark the feature as planned.

## 11. Screenshots and Project Structure

### Screenshots

Add screenshots of the working application to a `screenshots/` directory.

Recommended screenshots:

1. Employee dashboard with summary cards.
2. Employee directory showing serial numbers and status.
3. Add Employee form.
4. Employee Details view.
5. Edit Employee form.
6. Delete confirmation dialog.
7. Search and filter functionality.
8. CSV export result.
9. Swagger/OpenAPI documentation.
10. Successful test execution.

Embed screenshots in this README after adding the image files. For example:

```markdown
![PeopleDesk Employee Dashboard](screenshots/dashboard.png)
```

### Project Structure

The following is an example structure. Adjust it to match the files actually present in the repository.

```text
kloudstaff-employee-management/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── screenshots/
├── .gitignore
└── README.md
```

The `docker-compose.yml` file and screenshots directory are optional until those deliverables are added.

