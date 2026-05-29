import React from 'react';
import './TestVitals.css';

const parseHeightToInches = (heightStr) => {
  if (!heightStr) return null;
  // Handle formats: "5'10\"", "5'10", "70", "5 ft 10 in", "5.10"
  const ftIn = heightStr.match(/(\d+)['\s][\s]?(\d+)/);
  if (ftIn) return parseInt(ftIn[1]) * 12 + parseInt(ftIn[2]);
  const inOnly = heightStr.match(/^(\d+(?:\.\d+)?)$/);
  if (inOnly) return parseFloat(inOnly[1]);
  return null;
};

const TestVitals = ({ patient, notes, onNotesChange, assessment, onAssessmentChange }) => {
  const heightInches = parseHeightToInches(patient.height);
  const idealWeightRange = heightInches
    ? `${Math.round(18.5 * heightInches * heightInches / 703)} – ${Math.round(24.9 * heightInches * heightInches / 703)} lbs`
    : '—';

  return (
    <div className="section-container">
      <h2 className="section-title">Test Vitals</h2>
      <p className="section-subtitle">Vital signs and measurements</p>
      
      <div className="vitals-grid">
        <div className="vital-item">
          <label>Height</label>
          <input type="text" value={patient.height} readOnly />
        </div>

        <div className="vital-item">
          <label>Weight (lbs)</label>
          <input type="text" value={patient.weight} readOnly />
        </div>

        <div className="vital-item">
          <label>BMI</label>
          <input type="text" value={patient.bmi} readOnly className="bmi-calculated" />
        </div>

        <div className="vital-item">
          <label>Ideal Weight (Normal BMI)</label>
          <input type="text" value={idealWeightRange} readOnly className="bmi-calculated" />
        </div>

        <div className="vital-item">
          <label>Blood Pressure</label>
          <input type="text" value={patient.bloodPressure} readOnly />
        </div>

        <div className="vital-item">
          <label>O2 Level (%)</label>
          <div className="vital-input-group">
            <input type="text" value={patient.o2} readOnly />
            <span className="unit">%</span>
          </div>
        </div>

        <div className="vital-item">
          <label>Heart Rate (bpm)</label>
          <div className="vital-input-group">
            <input type="text" value={patient.heartRate} readOnly />
            <span className="unit">bpm</span>
          </div>
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

export default TestVitals;
