import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaUsers, 
  FaUserPlus, 
  FaUserEdit, 
  FaUserSlash,
  FaUserCircle,
  FaPhone,
  FaStethoscope,
  FaShieldAlt,
  FaSearch,
  FaIdCard,
  FaLock,
  FaUserMd,
  FaHospital,
  FaClock
} from 'react-icons/fa';
import './UserManagement.css';
import LoginBackground from './LoginBackground.jpg';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: '',
    contact: '',
    specialization: '',
    availability: 'Available'
  });

  const roleOptions = ['Admin', 'Doctor', 'Receptionist'];
  const specializationOptions = [
    'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology',
    'Dermatology', 'Emergency Medicine', 'Internal Medicine',
    'Radiology', 'Pathology', 'Psychiatry', 'Urology', 'Oncology',
    'General Surgery', 'Family Medicine'
  ];
  const availabilityOptions = ['Available', 'Busy', 'Off Duty', 'On Call'];

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      const [adminsRes, doctorsRes, receptionistsRes] = await Promise.all([
        api.get('/Admin').catch(() => ({ data: [] })),
        api.get('/Doctor').catch(() => ({ data: [] })),
        api.get('/Receptionist').catch(() => ({ data: [] }))
      ]);

      const admins = (adminsRes.data || []).map(a => ({
        id: a.adminID,
        name: a.name,
        username: a.username,
        role: 'Admin',
        contact: a.contact,
        specialization: '-'
      }));

      const doctors = (doctorsRes.data || []).map(d => ({
        id: d.doctorID,
        name: d.name,
        username: d.username,
        role: 'Doctor',
        contact: '-',  // Doctor doesn't have contact
        specialization: d.specialization || '-',
        availability: d.availability
      }));

      const receptionists = (receptionistsRes.data || []).map(r => ({
        id: r.staffID,
        name: r.name,
        username: r.username,
        role: 'Receptionist',
        contact: r.contact,
        specialization: '-'
      }));

      setUsers([...admins, ...doctors, ...receptionists]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      role: '',
      contact: '',
      specialization: '',
      availability: 'Available'
    });
    setSelectedUser(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || '',
      username: user.username || '',
      password: '',
      role: user.role || '',
      contact: user.contact !== '-' ? user.contact : '',
      specialization: user.specialization !== '-' ? user.specialization : '',
      availability: user.availability || 'Available'
    });
    setSelectedUser(user);
    setEditMode(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, username, password, role, contact, specialization, availability } = formData;

      if (editMode && selectedUser) {
        // ============================================
        // UPDATE EXISTING USER
        // ============================================
        const currentRole = selectedUser.role;
        let endpoint = '';

        if (currentRole === 'Admin') endpoint = `/Admin/${selectedUser.id}`;
        else if (currentRole === 'Doctor') endpoint = `/Doctor/${selectedUser.id}`;
        else if (currentRole === 'Receptionist') endpoint = `/Receptionist/${selectedUser.id}`;

        // Build payload based on role
        const updatePayload = { name, username };

        if (password) updatePayload.password = password;

        if (currentRole === 'Doctor') {
          // Doctor: no contact, only specialization + availability
          updatePayload.specialization = specialization;
          updatePayload.availability = availability;
        } else {
          // Admin & Receptionist: contact only
          updatePayload.contact = contact;
        }

        await api.put(endpoint, updatePayload);
        toast.success('User updated successfully!');

      } else {
        // ============================================
        // CREATE NEW USER
        // ============================================
        let endpoint = '';
        let payload = { name, username, password };

        if (role === 'Admin') {
          endpoint = '/Admin';
          payload.contact = contact;
        } else if (role === 'Doctor') {
          endpoint = '/Doctor';
          payload.specialization = specialization || 'General';
          payload.availability = availability || 'Available';
          // No contact for doctors
        } else if (role === 'Receptionist') {
          endpoint = '/Receptionist';
          payload.contact = contact;
        }

        await api.post(endpoint, payload);
        toast.success(`${role} added successfully!`);
      }

      setShowForm(false);
      setSelectedUser(null);
      setEditMode(false);
      fetchAllUsers();

    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.response?.data?.error || error.response?.data || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      let endpoint = '';
      if (role === 'Admin') endpoint = `/Admin/${id}`;
      else if (role === 'Doctor') endpoint = `/Doctor/${id}`;
      else if (role === 'Receptionist') endpoint = `/Receptionist/${id}`;

      await api.delete(endpoint);
      toast.success('User deleted successfully');
      fetchAllUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoBack = () => navigate('/dashboard');

  const getRoleColor = (role) => ({
    'Admin': '#8b5cf6',
    'Doctor': '#3b82f6',
    'Receptionist': '#10b981'
  }[role] || '#64748b');

  const getRoleIcon = (role) => ({
    'Admin': <FaShieldAlt />,
    'Doctor': <FaUserMd />,
    'Receptionist': <FaHospital />
  }[role] || <FaUserCircle />);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="user-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="user-overlay">

        {/* Header */}
        <div className="user-header">
          <div className="header-left">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft /> Back to Dashboard
            </button>
            <div className="header-title">
              <h2><FaUsers className="header-icon" /> User Management</h2>
              <p>Manage system users and their roles</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-user-btn" onClick={handleAddNew}>
              <FaUserPlus /> Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{users.filter(u => u.role === 'Admin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{users.filter(u => u.role === 'Doctor').length}</span>
            <span className="stat-label">Doctors</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{users.filter(u => u.role === 'Receptionist').length}</span>
            <span className="stat-label">Receptionists</span>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>
                {editMode ? <FaUserEdit /> : <FaUserPlus />}
                {editMode ? `Edit ${selectedUser?.name}` : 'Add New User'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Name & Username - All roles */}
                <div className="form-row">
                  <div className="form-group">
                    <label><FaUserCircle className="label-icon" /> Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FaIdCard className="label-icon" /> Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                {/* Password & Role - All roles */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaLock className="label-icon" /> Password {editMode ? '(leave blank to keep)' : '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={editMode ? 'Leave blank to keep current' : 'Enter password'}
                      required={!editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label><FaShieldAlt className="label-icon" /> Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      disabled={editMode}
                    >
                      <option value="">Select Role</option>
                      {roleOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ============================================
                    ROLE-SPECIFIC FIELDS
                    ============================================ */}

                {/* DOCTOR: Specialization + Availability (NO CONTACT) */}
                {formData.role === 'Doctor' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label><FaStethoscope className="label-icon" /> Specialization *</label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Specialization</option>
                          {specializationOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label><FaClock className="label-icon" /> Availability</label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                        >
                          {availabilityOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* ADMIN & RECEPTIONIST: Contact */}
                {(formData.role === 'Admin' || formData.role === 'Receptionist') && (
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaPhone className="label-icon" /> Contact</label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        maxLength={formData.role === 'Admin' ? 10 : 50}
                      />
                    </div>
                    <div className="form-group"></div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <span className="spinner"></span> : (editMode ? 'Update' : 'Add')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-users">
                    <FaUsers className="no-icon" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={`${user.role}-${user.id}`}>
                    <td>
                      <div className="user-cell">
                        <FaUserCircle className="user-avatar" />
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {String(user.id).padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <span
                        className="role-badge"
                        style={{
                          backgroundColor: getRoleColor(user.role) + '20',
                          color: getRoleColor(user.role),
                          borderColor: getRoleColor(user.role) + '30'
                        }}
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td>{user.contact || '-'}</td>
                    <td>{user.specialization || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                          title="Edit"
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user.id, user.role)}
                          title="Delete"
                        >
                          <FaUserSlash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;