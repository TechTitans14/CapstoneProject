import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import './PatientRegistration.css';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    contact: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData({
      ...formData,
      gender: gender
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/patients/register', formData);
      toast.success('Patient registered successfully!');
      
      setFormData({
        name: '',
        idNumber: '',
        contact: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        password: ''
      });
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>Patient Registration</h2>
        
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
              <label>ID Number *</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <div className="gender-buttons">
              {genderOptions.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  className={`gender-btn ${formData.gender === gender ? 'selected' : ''}`}
                  onClick={() => handleGenderSelect(gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            
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
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;