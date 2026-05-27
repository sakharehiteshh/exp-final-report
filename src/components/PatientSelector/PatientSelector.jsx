import React from 'react';
import './PatientSelector.css';

const PatientSelector = ({ patients, onSelect, viewedPatients = new Set() }) => {
  const sortedPatients = [...patients].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB - dateA;
  });

  return (
    <div className="patient-selector-container">
      <label htmlFor="patient-select">Select Patient:</label>
      <select
        id="patient-select"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>-- Select a Patient --</option>
        {sortedPatients.map(patient => {
          const viewed = viewedPatients.has(patient.id);
          return (
            <option
              key={patient.id}
              value={patient.id}
              style={viewed ? { backgroundColor: '#d0f0fb', color: '#0e5f78' } : {}}
            >
              {viewed ? '✓ ' : ''}{patient.name} - {patient.timestamp}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default PatientSelector;
