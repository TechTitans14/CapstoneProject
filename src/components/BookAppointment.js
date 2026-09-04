import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import './BookAppointment.css';

const BookAppointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientID: '',
    doctorID: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
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
      await api.post('/appointments/book', formData);
      toast.success('Appointment booked successfully!');
      
      setFormData({
        patientID: '',
        doctorID: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
      });
    } catch (error) {
      toast.error(error.response?.data || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="book-appointment-container">
      <div className="book-appointment-card">
        <h2>Book Appointment</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient *</label>
              <select
                name="patientID"
                value={formData.patientID}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientID} value={patient.patientID}>
                    {patient.name} - {patient.idNumber}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Doctor *</label>
              <select
                name="doctorID"
                value={formData.doctorID}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorID} value={doctor.doctorID}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;