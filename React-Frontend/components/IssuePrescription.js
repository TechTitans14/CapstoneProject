import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaUserMd, 
  FaSearch,
  FaPrescription,
  FaFileMedical,
  FaPrint,
  FaSave,
  FaPlus,
  FaHistory,
  FaCalendarDay,
  FaPills
} from 'react-icons/fa';
import './IssuePrescription.css';
import LoginBackground from './LoginBackground.jpg';

const IssuePrescription = () => {
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    duration: '',
    instructions: ''
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Patient');
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const filterByLetter = (letter) => {
    setActiveLetter(letter);
    
    const filtered = patients.filter(p => {
      const name = p.name || '';
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts[nameParts.length - 1] || '';
      
      return firstName.toUpperCase().startsWith(letter) || 
             lastName.toUpperCase().startsWith(letter);
    });
    
    setFilteredPatients(filtered);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setActiveLetter(null);
    
    if (term === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(p => 
        p.name?.toLowerCase().includes(term) ||
        p.idNumber?.includes(term)
      );
      setFilteredPatients(filtered);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveLetter(null);
    setFilteredPatients(patients);
  };

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    await fetchPatientPrescriptions(patient.patientID);
    setShowHistory(true);
  };

  const fetchPatientPrescriptions = async (patientId) => {
    try {
      const response = await api.get(`/Prescription/patient/${patientId}`);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
  };

  const handleBackToSearch = () => {
    setSelectedPatient(null);
    setShowHistory(false);
    setPrescriptions([]);
    setNewPrescription({
      medication: '',
      dosage: '',
      duration: '',
      instructions: ''
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewPrescriptionChange = (e) => {
    setNewPrescription({
      ...newPrescription,
      [e.target.name]: e.target.value
    });
  };

  // ============================================
  // ✅ COMPLETE WORKING VERSION
  // ============================================
  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newPrescription.medication.trim()) {
      toast.error('Please enter medication name');
      return;
    }
    if (!newPrescription.dosage.trim()) {
      toast.error('Please enter dosage information');
      return;
    }
    if (!newPrescription.duration.trim()) {
      toast.error('Please enter treatment duration');
      return;
    }

    setSubmitting(true);

    try {
      console.log('========================================');
      console.log('💊 Starting Prescription Creation');
      console.log('========================================');
      console.log(`👤 Patient: ${selectedPatient.name} (ID: ${selectedPatient.patientID})`);

      // ✅ Step 1: Get the patient's medical records
      console.log(`🔍 Fetching medical records for patient: ${selectedPatient.patientID}`);
      const medicalRecordsResponse = await api.get(`/MedicalRecord/patient/${selectedPatient.patientID}`);
      const records = medicalRecordsResponse.data;
      
      console.log(`📋 Found ${records?.length || 0} medical records`);
      
      // ✅ Check if records exist
      if (!records || records.length === 0) {
        toast.error('No medical record found for this patient. Please create a consultation first.');
        setSubmitting(false);
        return;
      }

      // ✅ Use the most recent medical record
      const latestRecord = records[0];
      const recordId = latestRecord.recordID;
      console.log(`✅ Using latest record ID: ${recordId}`);
      console.log(`   Diagnosis: ${latestRecord.diagnosis}`);
      console.log(`   Visit Date: ${latestRecord.visitDate}`);

      // ✅ Step 2: Create the prescription
      const prescriptionData = {
        recordID: recordId,
        medication: newPrescription.medication.trim(),
        dosage: newPrescription.dosage.trim(),
        duration: newPrescription.duration.trim(),
        instructions: newPrescription.instructions.trim() || null,
        createdAt: new Date().toISOString()
      };

      console.log('💊 Creating prescription:', JSON.stringify(prescriptionData, null, 2));
      
      const response = await api.post('/Prescription', prescriptionData);
      
      console.log('✅ Prescription created successfully!');
      console.log(`   Prescription ID: ${response.data.prescriptionID}`);
      console.log('========================================');
      
      toast.success('Prescription issued successfully!');
      
      // ✅ Refresh the prescription list
      await fetchPatientPrescriptions(selectedPatient.patientID);
      
      // ✅ Reset form
      setNewPrescription({
        medication: '',
        dosage: '',
        duration: '',
        instructions: ''
      });
      
    } catch (error) {
      console.error('❌ Error issuing prescription:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Show user-friendly error message
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.details || 
                       error.response?.data || 
                       'Failed to issue prescription';
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Failed to issue prescription');
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="prescription-loading">
        <div className="loading-spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  // Patient History View
  if (showHistory && selectedPatient) {
    return (
      <div className="issue-prescription-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
        <div className="prescription-overlay">
          <div className="prescription-card full-width">
            <div className="prescription-header">
              <button className="back-btn" onClick={handleBackToSearch}>
                <FaArrowLeft />
                Back to Patients
              </button>
              <div className="header-title">
                <h2>
                  <FaPrescription className="header-icon" />
                  Prescriptions for {selectedPatient.name}
                </h2>
                <p>ID: {selectedPatient.idNumber} • {selectedPatient.contact}</p>
              </div>
              <div className="header-actions">
                <button className="print-btn" onClick={handlePrint}>
                  <FaPrint /> Print
                </button>
              </div>
            </div>

            <div className="prescription-history">
              <div className="history-header">
                <h3>
                  <FaHistory className="section-icon" />
                  Prescription History
                </h3>
                <span className="history-count">{prescriptions.length} prescriptions</span>
              </div>
              
              {prescriptions.length === 0 ? (
                <div className="no-prescriptions">
                  <FaFileMedical className="no-icon" />
                  <p>No previous prescriptions found for this patient.</p>
                </div>
              ) : (
                <div className="prescriptions-list">
                  {prescriptions.map((prescription, index) => (
                    <div key={prescription.prescriptionID || index} className="prescription-item">
                      <div className="prescription-item-header">
                        <span className="prescription-date">
                          <FaCalendarDay />
                          {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        <span className="prescription-status">Active</span>
                      </div>
                      <div className="prescription-item-body">
                        <div className="medication-info">
                          <FaPills className="medication-icon" />
                          <span className="medication-name">{prescription.medication}</span>
                          <span className="medication-dosage">{prescription.dosage}</span>
                        </div>
                        <p className="duration-text">Duration: {prescription.duration}</p>
                        {prescription.instructions && (
                          <p className="instructions-text">📝 {prescription.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="new-prescription-section">
              <div className="section-header">
                <h4>
                  <FaPlus className="section-icon" />
                  Issue New Prescription
                </h4>
              </div>
              <form onSubmit={handleSubmitPrescription} className="prescription-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Medication *</label>
                    <input
                      type="text"
                      name="medication"
                      value={newPrescription.medication}
                      onChange={handleNewPrescriptionChange}
                      placeholder="Enter medication name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Dosage *</label>
                    <input
                      type="text"
                      name="dosage"
                      value={newPrescription.dosage}
                      onChange={handleNewPrescriptionChange}
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration *</label>
                    <input
                      type="text"
                      name="duration"
                      value={newPrescription.duration}
                      onChange={handleNewPrescriptionChange}
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Instructions</label>
                    <input
                      type="text"
                      name="instructions"
                      value={newPrescription.instructions}
                      onChange={handleNewPrescriptionChange}
                      placeholder="Special instructions"
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="spinner"></span>
                    ) : (
                      <>
                        <FaSave />
                        Save Prescription
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="print-btn-form"
                    onClick={handlePrint}
                  >
                    <FaPrint />
                    Print
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Patient Search View
  return (
    <div className="issue-prescription-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="prescription-overlay">
        <div className="prescription-card full-width">
          <div className="prescription-header">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft />
              Back to Dashboard
            </button>
            <div className="header-title">
              <h2>
                <FaPrescription className="header-icon" />
                Issue Prescription
              </h2>
              <p>Select a patient by name or ID number</p>
            </div>
          </div>

          <div className="search-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or ID number..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>✕</button>
              )}
            </div>
            <div className="search-hint">
              <span>Showing: {filteredPatients.length} patients</span>
              {activeLetter && <span>Filtered by: <strong>{activeLetter}</strong></span>}
            </div>
          </div>

          <div className="alphabet-nav">
            <span className="alphabet-label">🔤 Search by First or Last Name:</span>
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`alphabet-btn ${activeLetter === letter ? 'active' : ''}`}
                onClick={() => filterByLetter(letter)}
                title={`Patients with first or last name starting with ${letter}`}
              >
                {letter}
              </button>
            ))}
            <button
              className="alphabet-btn all-btn"
              onClick={clearSearch}
            >
              All
            </button>
          </div>

          <div className="patients-list">
            {filteredPatients.length === 0 ? (
              <div className="no-patients">
                <FaUserMd className="no-icon" />
                <p>No patients found</p>
                <span>Try a different letter or search term</span>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.patientID}
                  className="patient-item"
                  onClick={() => selectPatient(patient)}
                >
                  <div className="patient-avatar">
                    {getInitials(patient.name)}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <div className="patient-details">
                      <span className="patient-id">ID: {patient.idNumber}</span>
                      <span className="patient-contact">{patient.contact}</span>
                    </div>
                  </div>
                  <div className="patient-arrow">
                    →
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePrescription;