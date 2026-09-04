import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import './GenerateReports.css';

const GenerateReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    reportType: '',
    department: '',
    doctorID: '',
    startDate: '',
    endDate: ''
  });
  const [doctors, setDoctors] = useState([]);

  const reportTypes = ['Appointment Report', 'Patient Report', 'Revenue Report', 'Prescription Report'];
  const departments = ['Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General'];

  useEffect(() => {
    fetchReports();
    fetchDoctors();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
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
      const response = await api.post('/reports/generate', formData);
      toast.success('Report generated successfully!');
      setReports([response.data, ...reports]);
      setFormData({
        reportType: '',
        department: '',
        doctorID: '',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      toast.error(error.response?.data || 'Failed to generate report');
    }
    setLoading(false);
  };

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded!');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="generate-reports-container">
      <div className="generate-reports-header">
        <h2>📊 Generate Reports</h2>
      </div>

      <div className="report-form-card">
        <h3>Generate New Report</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Report Type *</label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                required
              >
                <option value="">Select Report Type</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Doctor</label>
              <select
                name="doctorID"
                value={formData.doctorID}
                onChange={handleChange}
              >
                <option value="">All Doctors</option>
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
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="generate-btn" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>
      </div>

      <div className="reports-list">
        <h3>Recent Reports</h3>
        {reports.length === 0 ? (
          <p className="no-reports">No reports generated yet.</p>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.reportID} className="report-card">
                <div className="report-info">
                  <h4>{report.type}</h4>
                  <p><strong>Generated:</strong> {new Date(report.generatedAt).toLocaleString()}</p>
                  <p><strong>By:</strong> {report.admin?.name || 'Unknown'}</p>
                  {report.summary && <p><strong>Summary:</strong> {report.summary}</p>}
                </div>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(report.reportID)}
                >
                  📥 Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReports;