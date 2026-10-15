import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";


const API = "/api/employees";

const emptyEmployee = {
  fullName: "",
  email: "",
  phoneNumber: "",
  department: "",
  designation: "",
  dateOfJoining: "",
  salary: "",
  employmentStatus: "ACTIVE",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      // Fetch the first page to learn how many pages exist.
      const firstResponse = await axios.get(API, {
        params: { page: 0, size: 10 },
      });

      const firstData = firstResponse.data;

      let allEmployees = Array.isArray(firstData)
        ? firstData
        : firstData.content || [];

      // Fetch the remaining pages if the API uses pagination.
      if (!Array.isArray(firstData) && firstData.totalPages > 1) {
        const remainingRequests = [];

        for (let page = 1; page < firstData.totalPages; page++) {
          remainingRequests.push(
            axios.get(API, {
              params: { page, size: 10 },
            }),
          );
        }

        const remainingResponses = await Promise.all(remainingRequests);

        allEmployees = [
          ...allEmployees,
          ...remainingResponses.flatMap((response) =>
            Array.isArray(response.data)
              ? response.data
              : response.data.content || [],
          ),
        ];
      }

      console.log("Total employees loaded:", allEmployees.length);

      setEmployees(allEmployees);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load employees:", err);

      setError(
        "Unable to load employees. Check that the Spring Boot backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  
 
function exportEmployeesToCSV() {
  if (filtered.length === 0) {
    setError("There are no filtered employee records to export.");
    return;
  }

  const columns = [
    ["id", "Employee ID"],
    ["fullName", "Full Name"],
    ["email", "Email"],
    ["phoneNumber", "Phone Number"],
    ["department", "Department"],
    ["designation", "Designation"],
    ["dateOfJoining", "Date of Joining"],
    ["salary", "Salary"],
    ["employmentStatus", "Employment Status"],
  ];

  // Escape CSV values, including commas, quotes, and line breaks.
  const escapeCSV = (value) => {
    let text = value == null ? "" : String(value);

    // Prevent spreadsheet formula injection.
    if (/^[\s]*[=+\-@]/.test(text)) {
      text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  // Export only employees matching the current filters.
  const rows = [
    columns.map(([, heading]) => escapeCSV(heading)).join(","),
    ...filtered.map((employee) =>
      columns.map(([key]) => escapeCSV(employee[key])).join(",")
    ),
  ];

  const csv = "\uFEFF" + rows.join("\r\n");
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "filtered-employees.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  setError("");
}



  function openAddForm() {
    setEditingId(null);
    setForm(emptyEmployee);
    setShowForm(true);
    setError("");
    setFormError("");
  }

  function openEditForm(employee) {
    setEditingId(employee.id);
    setForm({
      ...emptyEmployee,
      ...employee,
      dateOfJoining: employee.dateOfJoining || "",
      salary: employee.salary ?? "",
    });
    setShowForm(true);
    setSelected(null);
    setError("");
    setFormError("");
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setFormError("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phoneNumber = form.phoneNumber.trim();
    const department = form.department.trim();
    const designation = form.designation.trim();
    const salary = Number(form.salary);

    // Phone number must contain exactly 10 digits.
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setFormError("Phone number must contain exactly 10 digits.");
      return;
    }

    // Validate email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Prevent duplicate email addresses for other employees.
    const duplicateEmail = employees.some(
      (employee) =>
        employee.email?.trim().toLowerCase() === email &&
        employee.id !== editingId,
    );

    if (duplicateEmail) {
      setFormError(
        "This email address is already registered to another employee.",
      );
      return;
    }

    // Prevent duplicate phone numbers for other employees.
    const duplicatePhone = employees.some(
      (employee) =>
        employee.phoneNumber?.trim() === phoneNumber &&
        employee.id !== editingId,
    );

    if (duplicatePhone) {
      setFormError(
        "This phone number is already registered to another employee.",
      );
      return;
    }

    if (!fullName || !department || !designation) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(salary) || salary < 0) {
      setFormError("Please enter a valid, non-negative salary.");
      return;
    }

    const payload = {
      ...form,
      fullName,
      email,
      phoneNumber,
      department,
      designation,
      salary,
    };

    try {
      if (editingId !== null) {
        await axios.put(`${API}/${editingId}`, payload);
      } else {
        await axios.post(API, payload);
      }

      setShowForm(false);
      setForm(emptyEmployee);
      setEditingId(null);
      setFormError("");
      await loadEmployees();
    } catch (err) {
      const data = err.response?.data;

      const message =
        data?.message ||
        data?.detail ||
        (typeof data === "string" ? data : null) ||
        "Could not save employee. Please check the details and try again.";

      setFormError(message);
    }
  }

  async function deleteEmployee() {
    if (!employeeToDelete || deleting) return;

    setDeleting(true);
    setError("");

    try {
      await axios.delete(`${API}/${employeeToDelete.id}`);

      setSelected(null);
      setEmployeeToDelete(null);
      await loadEmployees();
    } catch (err) {
      setError("Unable to delete this employee. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const departments = [
    ...new Set(employees.map((e) => e.department).filter(Boolean)),
  ];

  const filtered = employees.filter((employee) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (employee.fullName || "").toLowerCase().includes(term) ||
      (employee.email || "").toLowerCase().includes(term);
    const matchesStatus =
      statusFilter === "ALL" || employee.employmentStatus === statusFilter;
    const matchesDepartment =
      departmentFilter === "ALL" || employee.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedEmployees = filtered.slice(startIndex, startIndex + pageSize);

  // Return to page 1 whenever search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departmentFilter]);

  // Keep the current page valid after deleting employees.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">K</div>
          <div>
            <h1>
              People<span>Desk</span>
            </h1>
            <p>EMPLOYEE MANAGEMENT</p>
          </div>
        </div>
        <span className="system-label">Admin dashboard</span>
      </header>

      <section className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">WORKSPACE / PEOPLE</p>
            <h2>Employees</h2>
            <p className="subtitle">
              Manage your team, employee details and records.
            </p>
          </div>
          <button className="primary-button" onClick={openAddForm}>
            + Add employee
          </button>
        </div>

        <div className="stats">
          <div className="stat-card">
            <p>Total employees</p>
            <strong>{employees.length}</strong>
          </div>
          <div className="stat-card">
            <p>Active employees</p>
            <strong>
              {employees.filter((e) => e.employmentStatus === "ACTIVE").length}
            </strong>
          </div>
          <div className="stat-card">
            <p>Inactive employees</p>
            <strong>
              {
                employees.filter((e) => e.employmentStatus === "INACTIVE")
                  .length
              }
            </strong>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Employee directory</h3>
              <p>Search and manage employee records.</p>
            </div>
            
  <div className="panel-actions">
    <button
      className="secondary-button"
      onClick={exportEmployeesToCSV}
      disabled={loading || employees.length === 0}
    >
      ↓ Export CSV
    </button>

    <button className="secondary-button" onClick={loadEmployees}>
      ↻ Refresh
    </button>
  </div>

          </div>

          <div className="filters">
            <input
              aria-label="Search employees"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              aria-label="Filter by department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="ALL">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {loading ? (
            <p className="message">Loading employees...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">♙</div>
              <h3>No employees found</h3>
              <p>Add an employee or adjust your search filters.</p>
              <button className="primary-button" onClick={openAddForm}>
                + Add first employee
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                        <th>SL. NO.</th>

                    <th>EMPLOYEE</th>
                    <th>DEPARTMENT</th>
                    <th>DESIGNATION</th>
                    <th>JOINING DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                
<tbody>
  {paginatedEmployees.map((employee, index) => (
    <tr key={employee.id}>
      <td>{startIndex + index + 1}</td>

      <td>
        <button
          className="employee-name"
          onClick={() => setSelected(employee)}
        >
          {employee.fullName}
        </button>
        <span className="email">{employee.email}</span>
      </td>

      <td>{employee.department}</td>
      <td>{employee.designation}</td>
      <td>{employee.dateOfJoining}</td>

      <td>
        <span
          className={`status ${
            employee.employmentStatus === "ACTIVE"
              ? "active"
              : "inactive"
          }`}
        >
          {employee.employmentStatus}
        </span>
      </td>

      <td>
        <div className="actions">
          <button
            className="text-button"
            onClick={() => openEditForm(employee)}
          >
            Edit
          </button>
          <button
            className="text-button danger"
            onClick={() => setEmployeeToDelete(employee)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

              </table>
              <div className="table-footer">
                <span>
                  Showing {filtered.length === 0 ? 0 : startIndex + 1}–
                  {Math.min(startIndex + pageSize, filtered.length)} of{" "}
                  {filtered.length} employees
                </span>

                <div className="pagination">
                  <button
                    type="button"
                    className="page-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={`page-button ${
                        currentPage === page ? "active-page" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="page-button"
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      setCurrentPage((page) => Math.min(page + 1, totalPages));
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        <p className="footer-note">PeopleDesk · Employee Management System</p>
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <section className="modal">
            <div className="modal-heading">
              <div>
                <h2>{editingId !== null ? "Edit employee" : "Add employee"}</h2>
                <p>Enter the employee information below.</p>
              </div>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="form-error" role="alert">
                <span>{formError}</span>
                <button
                  type="button"
                  className="form-error-close"
                  onClick={() => setFormError("")}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={saveEmployee}>
              <div className="form-grid">
                {[
                  ["fullName", "Full name", "text"],
                  ["email", "Email address", "email"],
                  ["phoneNumber", "Phone number", "tel"],
                  ["department", "Department", "text"],
                  ["designation", "Designation", "text"],
                  ["dateOfJoining", "Date of joining", "date"],
                  ["salary", "Salary", "number"],
                ].map(([name, label, type]) => (
                  <label key={name}>
                    {label}
                    <input
                      type={type}
                      name={name}
                      value={form[name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [name]: e.target.value })
                      }
                      required
                      maxLength={name === "phoneNumber" ? 10 : undefined}
                      pattern={name === "phoneNumber" ? "[0-9]{10}" : undefined}
                      inputMode={name === "phoneNumber" ? "numeric" : undefined}
                      min={type === "number" ? "0" : undefined}
                      step={type === "number" ? "0.01" : undefined}
                    />
                  </label>
                ))}

                <label>
                  Employment status
                  <select
                    value={form.employmentStatus}
                    onChange={(e) =>
                      setForm({ ...form, employmentStatus: e.target.value })
                    }
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId !== null ? "Save changes" : "Create employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {employeeToDelete && (
        <div
          className="modal-backdrop delete-backdrop"
          onClick={() => {
            if (!deleting) setEmployeeToDelete(null);
          }}
        >
          <section
            className="modal delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon">!</div>

            <div className="delete-content">
              <h2 id="delete-title">Delete employee?</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{employeeToDelete.fullName}</strong>? This action cannot
                be undone.
              </p>
            </div>

            <div className="modal-actions delete-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={deleting}
                onClick={() => setEmployeeToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                disabled={deleting}
                onClick={deleteEmployee}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </section>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <section
            className="modal details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">EMPLOYEE DETAILS</p>
                <h2>{selected.fullName}</h2>
                <p>{selected.designation}</p>
              </div>
              <button
                className="close-button"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="details-grid">
              {[
                ["Employee ID", selected.id],
                ["Email", selected.email],
                ["Phone", selected.phoneNumber],
                ["Department", selected.department],
                ["Designation", selected.designation],
                ["Date of joining", selected.dateOfJoining],
                ["Salary", selected.salary],
                ["Status", selected.employmentStatus],
              ].map(([label, value]) => (
                <div className="detail-item" key={label}>
                  <span>{label}</span>
                  <strong>{value ?? "—"}</strong>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="primary-button"
                onClick={() => openEditForm(selected)}
              >
                Edit employee
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
