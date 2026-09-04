import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import './ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.put(`/appointments/cancel/${id}`);
        toast.success('Appointment cancelled');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleReschedule = async (id) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM:SS):');
    
    if (newDate && newTime) {
      try {
        await api.put(`/appointments/reschedule/${id}`, {
          newDate: newDate,
          newTime: newTime
        });
        toast.success('Appointment rescheduled');
        fetchAppointments();
      } catch (error) {
        toast.error(error.response?.data || 'Failed to reschedule');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="manage-appointments-container">
      <div className="manage-header">
        <h2>Manage Appointments</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="appointments-table-wrapper">
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
                <td>{appointment.patient?.name}</td>
                <td>{appointment.doctor?.name}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>{appointment.appointmentTime}</td>
                <td>
                  <span className={`status-badge ${appointment.status?.toLowerCase() || 'scheduled'}`}>
                    {appointment.status || 'Scheduled'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="reschedule-btn"
                      onClick={() => handleReschedule(appointment.appointmentID)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(appointment.appointmentID)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAppointments;