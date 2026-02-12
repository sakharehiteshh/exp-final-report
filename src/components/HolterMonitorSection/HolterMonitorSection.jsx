"use client"
import "../TestSection.css"

const HolterMonitorSection = ({ assessment, onAssessmentChange, notes, onNotesChange }) => {

  return (
    <div className="section-container">
      <h2 className="section-title">Holter Monitor (Heart Monitor)</h2>
      <p className="section-subtitle">Continuous heart rhythm monitoring results</p>

      <div className="test-result-row">
        <label>Status</label>
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
        <label>Doctor's Notes</label>
        <textarea
          placeholder="Add notes on holter monitor findings..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows="4"
        />
      </div>
    </div>
  )
}

export default HolterMonitorSection
