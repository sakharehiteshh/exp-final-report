import React from 'react';
import './CholesterolSection.css';
import '../TestSection.css';

function getFlag(test, value) {
  const v = parseFloat(value);
  if (isNaN(v) || value === '' || value == null) return null;

  switch (test) {
    case 'totalCholesterol':
      if (v >= 240) return { type: 'high', label: '↑ HIGH' };
      if (v >= 200) return { type: 'borderline', label: '↑ BORDERLINE' };
      return null;
    case 'ldlCholesterol':
      if (v >= 160) return { type: 'high', label: '↑ HIGH' };
      if (v >= 130) return { type: 'borderline', label: '↑ BORDERLINE' };
      return null;
    case 'hdlCholesterol':
      if (v < 40) return { type: 'low', label: '↓ LOW' };
      return null;
    case 'triglycerides':
      if (v >= 200) return { type: 'high', label: '↑ HIGH' };
      if (v >= 150) return { type: 'borderline', label: '↑ BORDERLINE' };
      return null;
    case 'glucose':
      if (v < 70) return { type: 'low', label: '↓ LOW' };
      if (v >= 126) return { type: 'high', label: '↑ HIGH' };
      if (v >= 100) return { type: 'borderline', label: '↑ PRE-DIABETIC' };
      return null;
    default:
      return null;
  }
}

function FlaggedValue({ testKey, value, label }) {
  const flag = getFlag(testKey, value);
  return (
    <div className="cholesterol-item">
      <label>{label}</label>
      <div className="value-with-flag">
        <input
          type="text"
          value={value || ''}
          readOnly
          className={flag ? `chol-input-flagged chol-input-${flag.type}` : ''}
        />
        {flag && (
          <span className={`chol-flag-badge chol-flag-${flag.type}`}>
            {flag.label}
          </span>
        )}
      </div>
    </div>
  );
}

const CholesterolSection = ({ patient, notes, onNotesChange, assessment, onAssessmentChange }) => {
  const normalizedStatus = (patient.totalCholesterolStatus || '').toLowerCase().trim();
  const isPrelimNormal = normalizedStatus === 'normal';
  const isPrelimNeedsReview = normalizedStatus === 'needs review' || normalizedStatus === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">Finger Stick Cholesterol Test</h2>
      <p className="section-subtitle">Lipid profile results</p>

      <div className="cholesterol-grid">
        <FlaggedValue testKey="totalCholesterol" value={patient.totalCholesterol} label="Total Cholesterol (mg/dL)" />
        <FlaggedValue testKey="ldlCholesterol"   value={patient.ldlCholesterol}   label="LDL Cholesterol (mg/dL)" />
        <FlaggedValue testKey="hdlCholesterol"   value={patient.hdlCholesterol}   label="HDL Cholesterol (mg/dL)" />
        <FlaggedValue testKey="triglycerides"    value={patient.triglycerides}    label="Triglycerides (mg/dL)" />
        <FlaggedValue testKey="glucose"          value={patient.glucose}          label="Glucose (mg/dL)" />
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
            className={`status-btn selectable ${assessment === 'Normal' ? 'active normal' : ''}`}
            onClick={() => onAssessmentChange('Normal')}
          >
            Normal
          </button>
          <button
            className={`status-btn selectable ${assessment === 'Abnormal' ? 'active needs-review' : ''}`}
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
