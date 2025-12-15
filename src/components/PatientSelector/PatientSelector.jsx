import React from 'react';
import './PatientSelector.css';

const PatientSelector = ({ patients, onSelect }) => {
  const sortedPatients = [...patients].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA;
  });

  const formatTimestamp = (timestamp) => {
    // Format timestamp like "11/13/2025, 7:06:12 PM"
    return timestamp;
  };

  return (
    <div className="patient-selector-container">
      <label htmlFor="patient-select">Select Patient:</label>
      <select 
        id="patient-select"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>-- Select a Patient --</option>
        {sortedPatients.map(patient => (
          <option key={patient.id} value={patient.id}>
            {patient.name} - {formatTimestamp(patient.timestamp)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientSelector;
