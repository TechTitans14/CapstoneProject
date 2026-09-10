import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUserMd, FaIdCard, FaPhone, FaEnvelope, FaCalendarAlt, FaVenusMars, FaNotesMedical } from 'react-icons/fa';
import './PatientRegistration.css';
import LoginBackground from './LoginBackground.jpg';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    contact: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // ✅ Validate ID Number - only numbers, max 13 characters
    if (name === 'idNumber') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric
      if (numericValue.length <= 13) {
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
      return;
    }
    
    // ✅ Validate Contact Number - only numbers, max 10 characters
    if (name === 'contact') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric
      if (numericValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
      return;
    }
    
    // For all other fields
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenderSelect = (gender) => {
    setFormData({
      ...formData,
      gender: gender
    });
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    if (!formData.idNumber.trim()) {
      toast.error('Please enter ID number');
      return;
    }
    if (formData.idNumber.length !== 13) {
      toast.error('ID number must be exactly 13 digits');
      return;
    }
    if (!formData.contact.trim()) {
      toast.error('Please enter contact number');
      return;
    }
    if (formData.contact.length !== 10) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }
    if (!formData.gender) {
      toast.error('Please select gender');
      return;
    }

    setLoading(true);

    try {
      const patientData = {
        name: formData.name.trim(),
        idNumber: formData.idNumber.trim(),
        contact: formData.contact.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        email: formData.email.trim() || null,
        medicalHistory: formData.medicalHistory.trim() || null
      };

      console.log(' Registering patient:', patientData);
      await api.post('/Patient/register/', patientData);
      
      toast.success('Patient registered successfully!');
      
      // Reset form
      setFormData({
        name: '',
        idNumber: '',
        contact: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        medicalHistory: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="registration-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="registration-overlay">
        <div className="registration-card">
          {/* Header */}
          <div className="registration-header">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft />
              Back to Dashboard
            </button>
            <div className="header-title">
              <h2>
                <FaUserMd className="header-icon" />
                Patient Registration
              </h2>
              <p>Register a new patient in the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name - Required */}
            <div className="form-group">
              <label>
                <FaUserMd className="label-icon" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            {/* ID Number - Required, 13 digits */}
            <div className="form-group">
              <label>
                <FaIdCard className="label-icon" />
                ID Number * (13 digits)
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Enter 13-digit ID number"
                maxLength={13}
                required
              />
              <small className="field-hint">
                {formData.idNumber.length}/13 digits
              </small>
            </div>

            {/* Contact Number - Required, 10 digits */}
            <div className="form-group">
              <label>
                <FaPhone className="label-icon" />
                Contact Number * (10 digits)
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter 10-digit contact number"
                maxLength={10}
                required
              />
              <small className="field-hint">
                {formData.contact.length}/10 digits
              </small>
            </div>

            {/* Email - Optional */}
            <div className="form-group">
              <label>
                <FaEnvelope className="label-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address (optional)"
              />
            </div>

            {/* Gender - Required */}
            <div className="form-group">
              <label>
                <FaVenusMars className="label-icon" />
                Gender *
              </label>
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

            {/* Date of Birth - Optional */}
            <div className="form-group">
              <label>
                <FaCalendarAlt className="label-icon" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Medical History - Optional */}
            <div className="form-group">
              <label>
                <FaNotesMedical className="label-icon" />
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows="2"
                placeholder="Enter any medical history (optional)"
              />
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleGoBack}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="register-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <FaUserMd />
                    Register Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;