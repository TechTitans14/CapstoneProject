import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaHospital,
  FaUserMd,
  FaProcedures,
  FaAmbulance,
  FaBell,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaUserCircle,
  FaClipboardList,
  FaSyringe,
  FaPills,
  FaStethoscope,
  FaFileMedical,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import './AdminDashboard.css';

// Import the same background image
import DashboardBackground from './LoginBackground.jpg';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats data
  const stats = [
    { label: 'Total Patients', value: '2,847', change: '+12.5%', trend: 'up', icon: FaProcedures, color: '#0d9488' },
    { label: 'Doctors', value: '156', change: '+5.2%', trend: 'up', icon: FaUserMd, color: '#3b82f6' },
    { label: 'Appointments Today', value: '89', change: '+8.1%', trend: 'up', icon: FaCalendarCheck, color: '#8b5cf6' },
    { label: 'Revenue', value: '$45.2K', change: '-2.4%', trend: 'down', icon: FaMoneyBillWave, color: '#f59e0b' },
  ];

  // Recent appointments
  const recentAppointments = [
    { id: 1, patient: 'Sarah Johnson', doctor: 'Dr. Emily Chen', time: '09:00 AM', status: 'Completed', type: 'Checkup' },
    { id: 2, patient: 'Michael Smith', doctor: 'Dr. James Wilson', time: '10:30 AM', status: 'In Progress', type: 'Consultation' },
    { id: 3, patient: 'Emma Davis', doctor: 'Dr. Sarah Parker', time: '01:15 PM', status: 'Scheduled', type: 'Follow-up' },
    { id: 4, patient: 'Robert Brown', doctor: 'Dr. Michael Lee', time: '03:45 PM', status: 'Cancelled', type: 'Emergency' },
  ];

  // Activity feed
  const activities = [
    { id: 1, message: 'New patient registered: Lisa Anderson', time: '5 min ago', type: 'patient' },
    { id: 2, message: 'Appointment rescheduled: John Doe (Dr. Chen)', time: '18 min ago', type: 'appointment' },
    { id: 3, message: 'Lab results uploaded for patient #2847', time: '42 min ago', type: 'lab' },
    { id: 4, message: 'New prescription added for Maria Garcia', time: '1 hour ago', type: 'prescription' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Completed': '#10b981',
      'In Progress': '#3b82f6',
      'Scheduled': '#8b5cf6',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Completed': <FaCheckCircle />,
      'In Progress': <FaClock />,
      'Scheduled': <FaCalendarCheck />,
      'Cancelled': <FaExclamationTriangle />
    };
    return icons[status] || null;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaHospital className="logo-icon" />
            <span>MediCare</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaHome /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <FaUsers /> Patients
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <FaCalendarCheck /> Appointments
          </button>
          <button 
            className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <FaUserMd /> Doctors
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FaChartLine /> Reports
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p className="header-date">{formatDate()}</p>
          </div>

          <div className="header-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patients, doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>

            <div className="admin-profile">
              <FaUserCircle className="profile-avatar" />
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                  <stat.icon />
                </div>
                <span className="stat-change" style={{ color: stat.trend === 'up' ? '#10b981' : '#ef4444' }}>
                  {stat.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Recent Appointments */}
          <section className="dashboard-card appointments-card">
            <div className="card-header">
              <h2>Recent Appointments</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="appointments-list">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <div className="appointment-patient">
                      <FaUserCircle className="patient-avatar" />
                      <div>
                        <h4>{appointment.patient}</h4>
                        <p>{appointment.doctor}</p>
                      </div>
                    </div>
                    <div className="appointment-meta">
                      <span className="appointment-time">{appointment.time}</span>
                      <span className="appointment-type">{appointment.type}</span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getStatusColor(appointment.status) + '20',
                        color: getStatusColor(appointment.status)
                      }}
                    >
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="dashboard-card activity-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <span className="time-display">{formatTime()}</span>
            </div>
            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'patient' && <FaUserCircle />}
                    {activity.type === 'appointment' && <FaCalendarCheck />}
                    {activity.type === 'lab' && <FaSyringe />}
                    {activity.type === 'prescription' && <FaPills />}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <FaUserMd />
              <span>New Patient</span>
            </button>
            <button className="action-btn">
              <FaCalendarCheck />
              <span>Schedule Appointment</span>
            </button>
            <button className="action-btn">
              <FaClipboardList />
              <span>Medical Records</span>
            </button>
            <button className="action-btn">
              <FaFileMedical />
              <span>Generate Report</span>
            </button>
            <button className="action-btn">
              <FaAmbulance />
              <span>Emergency</span>
            </button>
            <button className="action-btn">
              <FaEnvelope />
              <span>Send Message</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;