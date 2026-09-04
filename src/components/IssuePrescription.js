import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import './IssuePrescription.css';

const IssuePrescription = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('recordId');
  
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    duration: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (recordId) {
      fetchPatientDetails();
    }
  }, [recordId]);

  const fetchPatientDetails = async () => {
    try {
      const response = await api.get(`/medicalrecords/${recordId}`);
      setPatient(response.data);
    } catch (error) {
      toast.error('Failed to fetch patient details');
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
      const prescriptionData = {
        recordId: parseInt(recordId),
        medication: formData.medication,
        dosage: formData.dosage,
        duration: formData.duration,
        instructions: formData.instructions
      };

      await api.post('/prescriptions', prescriptionData);
      toast.success('Prescription issued successfully!');
      navigate('/schedule-consultation');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to issue prescription');
    }
    setLoading(false);
  };

  if (!patient) {
    return <div className="loading">Loading patient details...</div>;
  }

  return (
    <div className="issue-prescription-container">
      <div className="issue-prescription-card">
        <h2>💊 Issue Prescription</h2>
        
        <div className="patient-info">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patient.patient?.name}</p>
          <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
          <p><strong>Treatment:</strong> {patient.treatment}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Medication Name *</label>
            <input
              type="text"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
              placeholder="Enter medication name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dosage *</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
                placeholder="e.g., 500mg"
              />
            </div>
            
            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g., 7 days"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
              placeholder="Any special instructions for the patient..."
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
              {loading ? 'Issuing...' : 'Issue Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssuePrescription;