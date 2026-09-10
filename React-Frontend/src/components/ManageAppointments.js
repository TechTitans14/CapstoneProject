import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaEdit, 
  FaTrash,
  FaCalendarCheck,
  FaClock,
  FaUserMd,
  FaStethoscope,
  FaSync,
  FaCalendarAlt
} from 'react-icons/fa';
import './ManageAppointments.css';
import LoginBackground from './LoginBackground.jpg';

const ManageAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/Appointment');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/Appointment/cancel/${id}`);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleReschedule = (appointment) => {
    // Navigate to book appointment page with appointment data
    navigate('/book-appointment', {
      state: {
        reschedule: true,
        appointmentId: appointment.appointmentID,
        patientID: appointment.patientID,
        doctorID: appointment.doctorID,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason
      }
    });
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format time
  const formatTime = (time) => {
    if (!time) return 'N/A';
    const parts = time.split(':');
    const hour = parseInt(parts[0]);
    const minute = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'rescheduled': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  if (loading) {
    return (
      <div className="manage-loading">
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="manage-appointments-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="manage-overlay">
        {/* Header */}
        <div className="manage-header">
          <div className="header-left">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft />
              Back to Dashboard
            </button>
            <div className="header-title">
              <h2>
                <FaCalendarCheck className="header-icon" />
                Manage Appointments
              </h2>
              <p>View and manage all patient appointments</p>
            </div>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by patient, doctor, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           
          </div>
        </div>

        

        {/* Table */}
        <div className="appointments-table-wrapper">
          {filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <FaCalendarCheck className="no-icon" />
              <h3>No appointments found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.appointmentID}>
                    <td>
                      <div className="cell-patient">
                        <FaUserMd className="cell-icon" />
                        <div>
                          <span className="cell-name">{appointment.patient?.name || 'Unknown'}</span>
                          <span className="cell-id">ID: {appointment.patient?.idNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-doctor">
                        <FaStethoscope className="cell-icon" />
                        <div>
                          <span className="cell-name">{appointment.doctor?.name || 'Unknown'}</span>
                          <span className="cell-specialty">{appointment.doctor?.specialization || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-date">
                        <FaCalendarAlt className="cell-icon-small" />
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="cell-time">
                        <FaClock className="cell-icon-small" />
                        {formatTime(appointment.appointmentTime)}
                      </div>
                    </td>
                    <td>
                      <span 
                        className={`status-badge ${appointment.status?.toLowerCase() || 'scheduled'}`}
                        style={{ borderColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.status || 'Scheduled'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="reschedule-btn"
                          onClick={() => handleReschedule(appointment)}
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                          title="Reschedule appointment"
                        >
                          <FaSync />
                          Reschedule
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(appointment.appointmentID)}
                          disabled={appointment.status === 'Cancelled' || appointment.status === 'Completed'}
                          title="Cancel appointment"
                        >
                          <FaTrash />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;