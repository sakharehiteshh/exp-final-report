import React from 'react';
import './HeartRiskScore.css';

const HeartRiskScore = ({ score, notes, onNotesChange, assessment, onAssessmentChange }) => {
  return (
    <div className="section-container">
      <h2 className="section-title">Heart Risk Score</h2>
      <p className="section-subtitle">Overall cardiovascular risk assessment (Abbott ASCVD Score)</p>
      
      <div className="risk-score-container">
        <label>Risk Score</label>
        <input 
          type="text" 
          value={score ? `${score}` : '<1%'} 
          readOnly 
          className="risk-score-input"
        />
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

export default HeartRiskScore;
