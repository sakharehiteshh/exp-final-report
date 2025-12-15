import React from 'react';
import './PatientDemographics.css';

const PatientDemographics = ({ patient }) => {
  const formatDate = (dateStr) => {
    // Handle date format like "4/5/1998"
    return dateStr;
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Patient Demographics</h2>
      
      <div className="demographics-grid">
        <div className="form-group">
          <label>Patient Name</label>
          <input type="text" value={patient.name} readOnly />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input type="text" value={formatDate(patient.dob)} readOnly />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="text" value={patient.age} readOnly />
        </div>

        <div className="form-group gender-group">
          <label>Gender</label>
          <div className="gender-options">
            <label className="radio-label">
              <input 
                type="radio" 
                name="gender" 
                checked={patient.gender === 'M'} 
                readOnly 
              />
              <span>Male</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="gender" 
                checked={patient.gender === 'F'} 
                readOnly 
              />
              <span>Female</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="gender" 
                checked={patient.gender !== 'M' && patient.gender !== 'F'} 
                readOnly 
              />
              <span>Unknown</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDemographics;
