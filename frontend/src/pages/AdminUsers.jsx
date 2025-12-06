import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listEmployees, createEmployee, deleteEmployee, updateEmployee } from '../services/dotnetApi'
import { useState } from 'react'

const AdminUsers = () => {
  const queryClient = useQueryClient()

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: listEmployees,
  })

  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee',
    department: '',
    phone: '',
  })

  const [employeeEdits, setEmployeeEdits] = useState({})

  const employeeCreateMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setEmployeeForm({
        firstName: '',
        lastName: '',
        email: '',
        role: 'employee',
        department: '',
        phone: '',
      })
    },
  })

  const employeeUpdateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateEmployee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })

  const employeeDeleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })

  if (isLoading) return <p>Loading users...</p>
  if (error) return <p className="error">{error.message}</p>

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Employees</p>
            <h2>Manage employees</h2>
          </div>
          <div className="pill">{employees.length} employees</div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>Name</span>
            <span>ID</span>
            <span>Email</span>
            <span>Department</span>
            <span>Role</span>
            <span>Phone</span>
            <span>Actions</span>
          </div>
          <div className="table-body">
            {employees.map((emp) => (
              <div key={emp.id} className="table-row">
                <span className="grid two">
                  <input
                    value={employeeEdits[emp.id]?.firstName ?? emp.firstName ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], firstName: e.target.value },
                      }))
                    }
                    placeholder="First Name"

                  />
                  <input
                    value={employeeEdits[emp.id]?.lastName ?? emp.lastName ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], lastName: e.target.value },
                      }))
                    }
                    placeholder="Last Name"

                  />
                </span>
                <span>#{emp.id}</span>
                <span>
                  <input
                  type='email'
                    value={employeeEdits[emp.id]?.email ?? emp.email ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], email: e.target.value },
                      }))
                    }
                    placeholder="Email"

                  />
                </span>
                <span>
                  <select
                    value={employeeEdits[emp.id]?.role ?? emp.role ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], role: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select role…</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </span>
                <span>
                  <input
                    value={employeeEdits[emp.id]?.department ?? emp.department ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], department: e.target.value },
                      }))
                    }
                    placeholder="Department"
                  />
                </span>
                <span>
                  <input
                    value={employeeEdits[emp.id]?.phone ?? emp.phone ?? ''}
                    onChange={(e) =>
                      setEmployeeEdits((prev) => ({
                        ...prev,
                        [emp.id]: { ...prev[emp.id], phone: e.target.value },
                      }))
                    }
                    placeholder="Phone"
                  />
                </span>
                <span className="actions">
                  <button
                    className="ghost small"
                    onClick={() =>
                      employeeUpdateMutation.mutate({
                        id: emp.id,
                        payload: {
                          firstName: employeeEdits[emp.id]?.firstName ?? emp.firstName,
                          lastName: employeeEdits[emp.id]?.lastName ?? emp.lastName,
                          email: employeeEdits[emp.id]?.email ?? emp.email,
                          role: employeeEdits[emp.id]?.role ?? emp.role,
                          department: employeeEdits[emp.id]?.department ?? emp.department,
                          phone: employeeEdits[emp.id]?.phone ?? emp.phone,
                        },
                      })
                    }
                    disabled={employeeUpdateMutation.isPending}
                  >
                    Save
                  </button>
                  <button
                    className="ghost small"
                    onClick={() => employeeDeleteMutation.mutate(emp.id)}
                    disabled={employeeDeleteMutation.isPending}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
            {employees.length === 0 ? <p className="muted">No employees found.</p> : null}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-header">
          <p className="eyebrow">Add employee</p>
          <h3>Create</h3>
        </div>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            employeeCreateMutation.mutate(employeeForm)
          }}
        >
          <div className="grid two">
            <label className="field">
              <span>First name</span>
              <input
                value={employeeForm.firstName}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, firstName: ev.target.value }))}
                required
                placeholder="First Name"
              />
            </label>
            <label className="field">
              <span>Last name</span>
              <input
                value={employeeForm.lastName}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, lastName: ev.target.value }))}
                required
                placeholder="Last Name"
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, email: ev.target.value }))}
                required
                placeholder="Email"
              />
            </label>
            <label className="field">
            <label className="field">
              <span>Role</span>
              <select
                value={employeeForm.role}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, role: ev.target.value }))}
              >
                <option value="">Select role…</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </label>
              <span>Department</span>
              <input
                value={employeeForm.department}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, department: ev.target.value }))}
                placeholder="Department"
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                value={employeeForm.phone}
                onChange={(ev) => setEmployeeForm((f) => ({ ...f, phone: ev.target.value }))}
                placeholder="Phone"
              />
            </label>
          </div>
          <button className="primary" type="submit" disabled={employeeCreateMutation.isPending}>
            {employeeCreateMutation.isPending ? 'Saving...' : 'Add employee'}
          </button>
        </form>
      </div>
    </>
  )
}

export default AdminUsers
