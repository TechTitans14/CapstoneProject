import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import './NewConsultation.css';

const NewConsultation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get('appointmentId');
  
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointment details');
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
      const consultationData = {
        appointmentId: parseInt(appointmentId),
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes
      };

      await api.post('/consultations', consultationData);
      toast.success('Consultation completed successfully!');
      navigate('/schedule-consultation');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to save consultation');
    }
    setLoading(false);
  };

  if (!appointment) {
    return <div className="loading">Loading appointment details...</div>;
  }

  return (
    <div className="new-consultation-container">
      <div className="new-consultation-card">
        <h2>🏥 New Consultation</h2>
        
        <div className="appointment-summary">
          <h3>Appointment Details</h3>
          <p><strong>Patient:</strong> {appointment.patient?.name}</p>
          <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {appointment.appointmentTime}</p>
          <p><strong>Reason:</strong> {appointment.reason || 'No reason provided'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Enter diagnosis details..."
            />
          </div>

          <div className="form-group">
            <label>Treatment Plan *</label>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Enter treatment plan..."
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/schedule-consultation')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConsultation;