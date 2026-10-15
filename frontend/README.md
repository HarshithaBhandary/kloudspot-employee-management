Employee Management System
A full-stack employee management application built as a software engineering assessment project. The application is organized into a Spring Boot REST API and a React frontend, with PostgreSQL used for persistent storage.
    Project status note: This README documents the intended setup and the stack currently identified for this repository. Before submission, verify that every listed endpoint and feature is implemented and working in your local copy. Do not describe tests or screenshots as completed unless you have actually run/created them.
Technology Stack
Backend: Java 17+, Spring Boot, Spring Data JPA, Maven
Database: PostgreSQL
Frontend: React, Vite, JavaScript, Axios
Testing: JUnit 5 and Mockito (add/confirm service-layer tests before submission)
API documentation: Swagger/OpenAPI (configure/verify before submission)
Version control: Git and GitHub
Main Features
The assessment scope includes the following employee fields:
Employee ID
Full name
Email
Phone
Department
Designation
Date of joining
Salary
Employment status
Expected application capabilities:
Create, view, update, and delete employee records
Search employees by name or email
Filter by department and employment status
Paginated employee listing
Responsive list, add, edit, and details views
REST API backed by persistent database storage
Check each feature in the running application before marking it as complete in the submission.
Repository Structure
```text
kloudstaff-employee-management/
├── backend/       # Spring Boot REST API and persistence layer
├── frontend/      # React + Vite user interface
├── README.md
└── docs/          # Optional screenshots, report, and API collection
```
The exact Java package/file structure may differ depending on your implementation.
Prerequisites
Install the following before running the application:
Java 17 or later
Node.js and npm
PostgreSQL
Git (optional, for version control)
Check versions:
```powershell
java -version
node --version
npm --version
```
Database Setup
Start PostgreSQL.
Create a database for the project, for example:
```sql
CREATE DATABASE employee_management;
```
Open the backend configuration, usually `backend/src/main/resources/application.properties` or `application.yml`.
Configure the database URL, username, password, and JPA settings. Example properties (replace the placeholders with your local values):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employee_management
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
Do not commit real passwords or other secrets. For a submitted project, prefer environment variables or a local, untracked configuration file for credentials. Confirm the actual property names and schema strategy used by your code.
Run the Backend
In PowerShell, from the project root:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The API is expected to start at `http://localhost:8080` unless the application configuration changes the port.
To run backend tests:
```powershell
cd backend
.\mvnw.cmd test
```
Run the Frontend
Open a second PowerShell terminal:
```powershell
cd frontend
npm install
npm run dev
```
Vite normally prints the local frontend URL (commonly `http://localhost:5173`). Use the URL printed in the terminal.
If the frontend uses a Vite proxy for `/api`, verify that `frontend/vite.config.js` or `vite.config.ts` forwards `/api` to `http://localhost:8080`. The frontend API base currently identified in the project is:
```js
const API = "/api/employees";
```
If the proxy is not configured, configure it or set the API base URL appropriately. Avoid hardcoding production secrets into frontend code.
REST API Reference
The following is the typical CRUD contract for an employee resource. Verify the actual controller mappings and request fields in your backend before using this as a final API specification.
Method	Example endpoint	Purpose
GET	`/api/employees?page=0&size=10`	List employees, potentially paginated
GET	`/api/employees/{id}`	Get one employee
POST	`/api/employees`	Create an employee
PUT	`/api/employees/{id}`	Update an employee
DELETE	`/api/employees/{id}`	Delete an employee
Example list request:
```powershell
Invoke-RestMethod "http://localhost:8080/api/employees?page=0&size=10"
```
If Spring Data pagination is enabled, a response may include `content`, `totalElements`, `totalPages`, `number`, and `last`. The exact response shape depends on your controller implementation.
Validation Checklist Before Submission
[ ] Backend starts successfully and connects to PostgreSQL.
[ ] Frontend starts and can call the backend API.
[ ] Create an employee and confirm it appears in the list.
[ ] View employee details.
[ ] Edit an employee and confirm the changes persist after refresh.
[ ] Delete an employee and confirm it is removed.
[ ] Search by full name and email.
[ ] Filter by department and employment status.
[ ] Test pagination with enough records to fill multiple pages.
[ ] Verify empty states, validation messages, and API error handling.
[ ] Run backend tests and record the actual result.
[ ] Build the frontend using `npm run build`.
[ ] Verify Swagger/OpenAPI if included.
[ ] Add a Postman collection with sample requests.
[ ] Add screenshots of the running application.
[ ] Remove credentials, local build folders, and unrelated files before pushing.
Suggested Submission Contents
```text
backend/
frontend/
README.md
docs/
  Employee_Management_System_Project_Report.pdf
  screenshots/
  employee-management-api.postman_collection.json
```
Include database setup instructions or SQL scripts if your project uses them. If you create a Postman collection or screenshots, ensure they correspond to the final, tested application.
Troubleshooting
Database connection failure: Confirm PostgreSQL is running, the database exists, and credentials match the backend configuration.
Port already in use: Stop the process using port 8080/5173 or change the configured port.
Frontend shows no data: Check the backend URL, browser console, network tab, and Vite proxy configuration.
CORS or 404 errors: Confirm controller mappings and proxy/CORS configuration match the frontend API path.
Only one page of employees is shown: Check whether the backend returns a Spring `Page` object and whether the frontend loads additional pages or uses backend pagination consistently.
Author
Harshitha Bhandary
Project: Employee Management System