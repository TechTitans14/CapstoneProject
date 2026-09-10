import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaCalendarCheck, 
  FaClipboardList,
  FaHospital,
  FaSignOutAlt,
  FaUsers,
  FaClock,
  FaCalendarDay,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import './ReceptionistDashboard.css';
import LoginBackground from './LoginBackground.jpg';

const ReceptionistDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Receptionist specific menu items
  const menuItems = [
    { 
      title: 'Register Patient', 
      path: '/register-patient', 
      icon: FaUserPlus,
      color: '#10b981',
      description: 'Add new patients to the system'
    },
    { 
      title: 'Book Appointment', 
      path: '/book-appointment', 
      icon: FaCalendarCheck,
      color: '#3b82f6',
      description: 'Schedule patient appointments'
    },
    { 
      title: 'Manage Appointments', 
      path: '/manage-appointments', 
      icon: FaClipboardList,
      color: '#8b5cf6',
      description: 'View and manage all appointments'
    },
  ];

  // Quick stats for receptionist
  const stats = [
    {
      number: '0',
      label: 'Today\'s Patients',
      icon: FaUsers,
      color: '#0d9488',
      bgColor: '#ccfbf1'
    },
    {
      number: '0',
      label: 'Today\'s Appointments',
      icon: FaCalendarDay,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      number: '0',
      label: 'Pending',
      icon: FaClock,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      number: '0',
      label: 'Completed',
      icon: FaClipboardList,
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
    <div className="receptionist-dashboard" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="receptionist-overlay">
        {/* Header */}
        <header className="receptionist-header">
          <div className="header-left">
            <div className="header-logo">
              <FaHospital className="logo-icon" />
              <span>MediCare</span>
            </div>
            <div className="header-info">
              <div className="receptionist-greeting">
                <h2>{getGreeting()}, {user?.name}!</h2>
                <span className="receptionist-title">Front Desk Receptionist</span>
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

        {/* Quick Contact */}
        <div className="receptionist-contact">
          <div className="contact-card">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-text">
              <span>Front Desk</span>
              <strong>021 543 6678</strong>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <div className="contact-text">
              <span>Email</span>
              <strong>frontdesk@medicare.com</strong>
            </div>
          </div>
        
        </div>

       

        {/* Welcome Section */}
        <div className="receptionist-welcome">
          <div className="welcome-card">
            <div className="welcome-icon">
              <FaHospital />
            </div>
            <div className="welcome-text">
              <h3>Welcome to Your Reception Dashboard</h3>
              <p>Manage patient registrations, book appointments, and keep the front desk running smoothly.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="receptionist-grid">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="receptionist-card"
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
        <div className="receptionist-footer">
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

export default ReceptionistDashboard;