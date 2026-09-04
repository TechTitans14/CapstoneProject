import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaStethoscope, 
  FaCalendarCheck, 
  FaFileAlt, 
  FaPrescription,
  FaUserMd,
  FaClock,
  FaHospital,
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaHistory
} from 'react-icons/fa';
import './DoctorDashboard.css';
import LoginBackground from './LoginBackground.jpg';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Doctor specific menu items
  const menuItems = [
    { 
      title: 'Schedule Consultation', 
      path: '/schedule-consultation', 
      icon: FaCalendarCheck,
      color: '#0d9488',
      description: 'View your daily consultation schedule'
    },
    { 
      title: 'New Consultation', 
      path: '/new-consultation', 
      icon: FaClipboardList,
      color: '#3b82f6',
      description: 'Create new patient consultation records'
    },
    { 
      title: 'Issue Prescription', 
      path: '/issue-prescription', 
      icon: FaPrescription,
      color: '#ef4444',
      description: 'Prescribe medication to patients'
    },
  ];

  // Quick stats for doctor
  const stats = [
    {
      number: '0',
      label: 'Today\'s Patients',
      icon: FaUserMd,
      color: '#0d9488',
      bgColor: '#ccfbf1'
    },
    {
      number: '0',
      label: 'Pending Consultations',
      icon: FaClock,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      number: '0',
      label: 'Active Prescriptions',
      icon: FaPrescription,
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      number: '0',
      label: 'Total Patients',
      icon: FaHistory,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get current date
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="doctor-dashboard" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="doctor-overlay">
        {/* Header */}
        <header className="doctor-header">
          <div className="header-left">
            <div className="header-logo">
              <FaHospital className="logo-icon" />
              <span>MediCare</span>
            </div>
            <div className="header-info">
              <div className="doctor-greeting">
                <h2>{getGreeting()},  {user?.name}!</h2>
                <span className="doctor-specialty">Medical Professional</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="header-date">
              <span>{getFormattedDate()}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="doctor-stats-row">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="doctor-stat-card" key={index}>
                <div className="stat-left">
                  <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                    <Icon />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
                <div className="stat-trend" style={{ color: stat.color }}>
                  <FaChartLine />
                </div>
              </div>
            );
          })}
        </div>

        {/* Welcome Section */}
        <div className="doctor-welcome">
          <div className="welcome-card">
            <div className="welcome-icon">
              <FaStethoscope />
            </div>
            <div className="welcome-text">
              <h3>Welcome to Your Practice Dashboard</h3>
              <p>Manage your consultations, issue prescriptions, and provide quality patient care - all from one place.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="doctor-grid">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="doctor-card"
                onClick={() => navigate(item.path)}
                style={{ borderTop: `4px solid ${item.color}` }}
              >
                <div className="card-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <Icon />
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="card-arrow" style={{ color: item.color }}>
                  →
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="doctor-footer">
          <div className="footer-activity">
            <div className="activity-indicator"></div>
            <span>You are logged in as <strong>{user?.name}</strong></span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-divider">|</span>
            <a href="#">Help Center</a>
            <span className="footer-divider">|</span>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;