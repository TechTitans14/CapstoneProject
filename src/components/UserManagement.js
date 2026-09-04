import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: '',
    contact: '',
    specialization: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/users', formData);
      toast.success('User added successfully!');
      setFormData({
        name: '',
        username: '',
        password: '',
        role: '',
        contact: '',
        specialization: ''
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add user');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>👤 User Management</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <h3>Add New User</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              {formData.role === 'Doctor' && (
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology"
                  />
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>
      )}

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                    className="role-select"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Receptionist">Receptionist</option>
                  </select>
                </td>
                <td>{user.contact || '-'}</td>
                <td>{user.specialization || '-'}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;