import React from 'react';
import './CholesterolSection.css';
import '../TestSection.css';

const CholesterolSection = ({ patient, notes, onNotesChange, assessment, onAssessmentChange }) => {
  const normalizedStatus = (patient.totalCholesterolStatus || '').toLowerCase().trim();
  const isPrelimNormal = normalizedStatus === 'normal';
  const isPrelimNeedsReview = normalizedStatus === 'needs review' || normalizedStatus === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">Finger Stick Cholesterol Test</h2>
      <p className="section-subtitle">Lipid profile results</p>

      <div className="cholesterol-grid">
        <div className="cholesterol-item">
          <label>Total Cholesterol (mg/dL)</label>
          <input type="text" value={patient.totalCholesterol || ''} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>LDL Cholesterol (mg/dL)</label>
          <input type="text" value={patient.ldlCholesterol || ''} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>HDL Cholesterol (mg/dL)</label>
          <input type="text" value={patient.hdlCholesterol || ''} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>Triglycerides (mg/dL)</label>
          <input type="text" value={patient.triglycerides || ''} readOnly />
        </div>

        <div className="cholesterol-item">
          <label>Glucose (mg/dL)</label>
          <input type="text" value={patient.glucose || ''} readOnly />
        </div>
      </div>

      <div className="test-result-row" style={{ marginTop: '16px' }}>
        <label>Prelim Status</label>
        <div className="status-buttons">
          <button className={`status-btn ${isPrelimNormal ? 'active normal' : ''}`} disabled>
            Normal
          </button>
          <button className={`status-btn ${isPrelimNeedsReview ? 'active needs-review' : ''}`} disabled>
            Needs Review
          </button>
        </div>
      </div>

      {patient.totalCholesterolNotes && (
        <div className="csv-notes-section">
          <label>Note:</label>
          <div className="csv-notes-content">{patient.totalCholesterolNotes}</div>
        </div>
      )}

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
