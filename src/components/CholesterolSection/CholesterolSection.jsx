import React from 'react';
import './CholesterolSection.css';

const CholesterolSection = ({ patient, notes, onNotesChange, assessment, onAssessmentChange }) => {
  return (
    <div className="section-container">
      <h2 className="section-title">Finger Stick Cholesterol Test</h2>
      <p className="section-subtitle">Lipid profile results</p>
      
      <div className="cholesterol-grid">
        <div className="cholesterol-item">
          <label>Total Cholesterol (mg/dL)</label>
          <input type="text" value={patient.totalCholesterol} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>LDL Cholesterol (mg/dL)</label>
          <input type="text" value={patient.ldlCholesterol} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>HDL Cholesterol (mg/dL)</label>
          <input type="text" value={patient.hdlCholesterol} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>Triglycerides (mg/dL)</label>
          <input type="text" value={patient.triglycerides} readOnly />
        </div>
      </div>

      <div className="test-result-row" style={{ marginTop: '20px' }}>
        <label>Doctor's Assessment</label>
        <div className="status-buttons">
          <button 
            className={`status-btn ${assessment === 'Normal' ? 'active normal' : ''}`}
            onClick={() => onAssessmentChange('Normal')}
          >
            Normal
          </button>
          <button 
            className={`status-btn ${assessment === 'Abnormal' ? 'active needs-review' : ''}`}
            onClick={() => onAssessmentChange('Abnormal')}
          >
            Abnormal
          </button>
        </div>
      </div>

      <div className="notes-section">
        <label className="notes-label">Doctor's Notes</label>
        <textarea
          className="notes-textarea"
          placeholder="Add your professional notes here..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows="4"
        />
      </div>
    </div>
  );
};

export default CholesterolSection;
