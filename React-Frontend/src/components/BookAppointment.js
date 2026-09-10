import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUserMd, FaStethoscope, FaCalendarAlt, FaClock, FaNotesMedical, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './BookAppointment.css';
import LoginBackground from './LoginBackground.jpg';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [isReschedule, setIsReschedule] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [formData, setFormData] = useState({
    patientID: '',
    doctorID: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (location.state?.reschedule) {
      const { appointmentId, patientID, doctorID, appointmentDate, appointmentTime, reason } = location.state;
      setIsReschedule(true);
      setRescheduleAppointmentId(appointmentId);
      setFormData({
        patientID: patientID || '',
        doctorID: doctorID || '',
        appointmentDate: appointmentDate || '',
        appointmentTime: appointmentTime || '',
        reason: reason || ''
      });
      setSelectedTime(appointmentTime || '');
     
    }
  }, [location.state]);

  
  useEffect(() => {
    if (formData.doctorID && formData.appointmentDate) {
      checkAvailability();
    }
  }, [formData.doctorID, formData.appointmentDate]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/Patient');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/Doctor');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
    }
  };

  // ✅ Check booked slots for the selected doctor and date
  const checkAvailability = async () => {
    if (!formData.doctorID || !formData.appointmentDate) return;
    
    setCheckingAvailability(true);
    try {
      const response = await api.get(`/Appointment/doctor/${formData.doctorID}`);
      const appointments = response.data;
      
      let slots = appointments
        .filter(a => a.appointmentDate === formData.appointmentDate && a.status !== 'Cancelled')
        .map(a => a.appointmentTime);
      
      // If rescheduling, exclude the current appointment from booked slots
      if (isReschedule && rescheduleAppointmentId) {
        const currentAppointment = appointments.find(a => a.appointmentID === rescheduleAppointmentId);
        if (currentAppointment) {
          slots = slots.filter(time => time !== currentAppointment.appointmentTime);
        }
      }
      
      setBookedSlots(slots);
      
      // Clear selected time if it's now booked
      if (formData.appointmentTime && slots.includes(formData.appointmentTime)) {
        setFormData(prev => ({ ...prev, appointmentTime: '' }));
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'appointmentDate' || name === 'doctorID') {
      setFormData({
        ...formData,
        [name]: value,
        appointmentTime: ''
      });
      setSelectedTime('');
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTimeSelect = (time) => {
    if (bookedSlots.includes(time)) {
      toast.error('This time slot is already booked. Please select a different time.');
      return;
    }
    
    setSelectedTime(time);
    setFormData({
      ...formData,
      appointmentTime: time
    });
  };

  const handleGoBack = () => {
    if (isReschedule) {
      navigate('/manage-appointments');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientID) {
      toast.error('Please select a patient');
      return;
    }
    if (!formData.doctorID) {
      toast.error('Please select a doctor');
      return;
    }
    if (!formData.appointmentDate) {
      toast.error('Please select a date');
      return;
    }
    if (!formData.appointmentTime) {
      toast.error('Please select a time');
      return;
    }

    if (bookedSlots.includes(formData.appointmentTime)) {
      toast.error('This time slot was just booked. Please select a different time.');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (isReschedule && rescheduleAppointmentId) {
        
        const rescheduleData = {
          newDate: formData.appointmentDate,
          newTime: formData.appointmentTime
        };
        console.log('📝 Rescheduling appointment:', rescheduleAppointmentId, rescheduleData);
        response = await api.put(`/Appointment/reschedule/${rescheduleAppointmentId}`, rescheduleData);
        toast.success('Appointment rescheduled successfully!');
      } else {
        
        const appointmentData = {
          patientID: parseInt(formData.patientID),
          doctorID: parseInt(formData.doctorID),
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          reason: formData.reason || null
        };
        console.log(' Booking appointment:', appointmentData);
        response = await api.post('/Appointment/book', appointmentData);
        toast.success(' Appointment booked successfully!');
      }
      
      // Reset form
      setFormData({
        patientID: '',
        doctorID: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
      });
      setSelectedTime('');
      setBookedSlots([]);
      setIsReschedule(false);
      setRescheduleAppointmentId(null);
      
      // Navigate back to manage appointments if reschedule, else dashboard
      navigate('/manage-appointments');
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 409) {
        toast.error(' This time slot is already booked. Please select a different time.');
      } else {
        toast.error(error.response?.data?.message || 'Booking failed');
      }
    }
    setLoading(false);
  };

  
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute > 0) continue;
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
        const displayTime = `${hour > 12 ? hour - 12 : hour}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push({ value: time, display: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  
  const isTimeBooked = (time) => bookedSlots.includes(time);

  return (
    <div className="book-appointment-container" style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div className="book-appointment-overlay">
        <div className="book-appointment-card">
          {/* Header */}
          <div className="book-appointment-header">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft />
              {isReschedule ? 'Back to Manage Appointments' : 'Back to Dashboard'}
            </button>
            <div className="header-title">
              <h2>
                <FaCalendarAlt className="header-icon" />
                {isReschedule ? 'Reschedule Appointment' : 'Book Appointment'}
              </h2>
              <p>{isReschedule ? 'Select a new time slot for this appointment' : 'Schedule a new patient appointment'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaUserMd className="label-icon" />
                  Patient *
                </label>
                <select
                  name="patientID"
                  value={formData.patientID}
                  onChange={handleChange}
                  required
                  disabled={isReschedule}
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
                <label>
                  <FaStethoscope className="label-icon" />
                  Doctor *
                </label>
                <select
                  name="doctorID"
                  value={formData.doctorID}
                  onChange={handleChange}
                  required
                  disabled={isReschedule}
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
                <label>
                  <FaCalendarAlt className="label-icon" />
                  Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              
              <div className="form-group time-selection">
                <label>
                  <FaClock className="label-icon" />
                  Select Time *
                </label>
                
                {!formData.doctorID || !formData.appointmentDate ? (
                  <div className="time-placeholder">
                    <FaClock className="placeholder-icon" />
                    <span>Please select a doctor and date first</span>
                  </div>
                ) : checkingAvailability ? (
                  <div className="time-loading">
                    <span className="loading-spinner-small"></span>
                    <span>Checking availability...</span>
                  </div>
                ) : (
                  <div className="time-grid">
                    {timeSlots.map((slot) => {
                      const booked = isTimeBooked(slot.value);
                      const selected = selectedTime === slot.value;
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          className={`time-slot-btn ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(slot.value)}
                          disabled={booked}
                        >
                          <span className="time-display">{slot.display}</span>
                          {booked ? (
                            <FaTimesCircle className="time-icon booked-icon" />
                          ) : selected ? (
                            <FaCheckCircle className="time-icon selected-icon" />
                          ) : (
                            <span className="time-available-dot"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {/* Availability Status */}
                {formData.doctorID && formData.appointmentDate && !checkingAvailability && (
                  <div className={`availability-status ${bookedSlots.length === 0 ? 'all-available' : bookedSlots.length < 6 ? 'partial' : 'most-booked'}`}>
                    <span className="status-text">
                      {bookedSlots.length === 0 ? (
                        <>All time slots available</>
                      ) : bookedSlots.length < 6 ? (
                        <>{bookedSlots.length} slots booked - Some time slots are taken</>
                      ) : (
                        <> {bookedSlots.length} slots booked - Most time slots are full</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaNotesMedical className="label-icon" />
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="Enter reason for appointment (optional)"
              />
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleGoBack}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="book-btn"
                disabled={loading || !formData.appointmentTime}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <FaCalendarAlt />
                    {isReschedule ? 'Reschedule Appointment' : 'Book Appointment'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;