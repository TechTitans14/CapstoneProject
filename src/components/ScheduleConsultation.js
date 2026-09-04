import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { 
  FaCalendarDay, 
  FaClock, 
  FaUserMd, 
  FaStethoscope,
  FaChevronRight,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft
} from 'react-icons/fa';
import './ScheduleConsultation.css';
import LoginBackground from './LoginBackground.jpg';

const ScheduleConsultation = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, upcoming
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.userId) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }
      
      const response = await api.get(`/Appointment/doctor/${userData.userId}`);
      setConsultations(response.data);
      
      if (response.data.length === 0) {
        console.log('No consultations found');
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch consultations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = (appointmentId) => {
    window.location.href = `/new-consultation?appointmentId=${appointmentId}`;
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  // Filter consultations
  const getFilteredConsultations = () => {
    const today = new Date().toDateString();
    
    if (filter === 'today') {
      return consultations.filter(c => 
        new Date(c.appointmentDate).toDateString() === today
      );
    } else if (filter === 'upcoming') {
      return consultations.filter(c => 
        new Date(c.appointmentDate) > new Date() && c.status !== 'Cancelled'
      );
    }
    return consultations;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return <FaHourglassHalf className="status-icon scheduled-icon" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed-icon" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled-icon" />;
      default:
        return <FaHourglassHalf className="status-icon scheduled-icon" />;
    }
  };

  const filteredConsultations = getFilteredConsultations();

  if (loading) {
    return (
      <div className="schedule-loading">
        <div className="loading-spinner"></div>
        <p>Loading your consultations...</p>
      </div>
    );
  }

  return (
    <div className="schedule-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="schedule-overlay">
        {/* Header */}
        <div className="schedule-header">
          <div className="header-left">
            <div className="header-top-row">
              <button className="back-btn" onClick={handleGoBack}>
                <FaArrowLeft />
                Back to Dashboard
              </button>
              <div className="header-title-group">
                <h2>
                  <FaCalendarDay className="header-icon" />
                  My Schedule
                </h2>
                <p>View and manage your daily consultation sessions</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
                onClick={() => setFilter('today')}
              >
                Today
              </button>
              <button 
                className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
            </div>
            <div className="schedule-count">
              <span>{filteredConsultations.length}</span>
              <span>consultations</span>
            </div>
          </div>
        </div>

        {/* Consultation List */}
        {filteredConsultations.length === 0 ? (
          <div className="no-consultations">
            <div className="empty-state">
              <FaClipboardList className="empty-icon" />
              <h3>No Consultations Found</h3>
              <p>
                {filter === 'today' 
                  ? "You don't have any consultations scheduled for today." 
                  : filter === 'upcoming'
                  ? "You don't have any upcoming consultations."
                  : "You don't have any consultations scheduled."}
              </p>
              <span className="empty-hint">Check back later for new appointments</span>
            </div>
          </div>
        ) : (
          <div className="consultations-grid">
            {filteredConsultations.map((consultation) => {
              const isToday = new Date(consultation.appointmentDate).toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={consultation.appointmentID} 
                  className={`consultation-card ${consultation.status?.toLowerCase()} ${isToday ? 'today' : ''}`}
                >
                  <div className="card-top">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        <FaUserMd />
                      </div>
                      <div>
                        <h3>{consultation.patient?.name || 'Unknown Patient'}</h3>
                        <span className="patient-id">ID: {consultation.patient?.idNumber || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="status-badge">
                      {getStatusIcon(consultation.status)}
                      <span className={`status-text ${consultation.status?.toLowerCase()}`}>
                        {consultation.status || 'Scheduled'}
                      </span>
                    </div>
                  </div>

                  <div className="card-middle">
                    <div className="detail-item">
                      <FaCalendarDay className="detail-icon" />
                      <span>
                        {new Date(consultation.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {isToday && <span className="today-badge">Today</span>}
                      </span>
                    </div>
                    <div className="detail-item">
                      <FaClock className="detail-icon" />
                      <span>{consultation.appointmentTime}</span>
                    </div>
                    <div className="detail-item">
                      <FaStethoscope className="detail-icon" />
                      <span>{consultation.reason || 'No reason provided'}</span>
                    </div>
                  </div>

                  <div className="card-bottom">
                    {consultation.status === 'Scheduled' && (
                      <button 
                        className="start-btn"
                        onClick={() => handleStartConsultation(consultation.appointmentID)}
                      >
                        Start Consultation
                        <FaChevronRight className="btn-arrow" />
                      </button>
                    )}
                    {consultation.status === 'Completed' && (
                      <div className="completed-label">
                        <FaCheckCircle />
                        Consultation Completed
                      </div>
                    )}
                    {consultation.status === 'Cancelled' && (
                      <div className="cancelled-label">
                        <FaTimesCircle />
                        Appointment Cancelled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleConsultation;