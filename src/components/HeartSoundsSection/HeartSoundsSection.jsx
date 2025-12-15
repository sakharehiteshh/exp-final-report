import React from 'react';
import '../TestSection.css';

const HeartSoundsSection = ({ 
  result, 
  notes, 
  csvNotes, 
  onNotesChange, 
  assessment, 
  onAssessmentChange 
}) => {
  const normalizedResult = (result || '').toLowerCase().trim();
  const isNormalPrelim = normalizedResult === 'normal';
  const isNeedsReviewPrelim =
    normalizedResult === 'needs review' || normalizedResult === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">Heart Sounds Exam</h2>
      <p className="section-subtitle">Auscultation examination results</p>
      
      {/* PRELIM STATUS */}
      <div className="test-result-row">
        <label>Status</label>
        <div className="status-buttons">
          <button 
            className={`status-btn ${isNormalPrelim ? 'active normal' : ''}`}
            disabled
          >
            Normal
          </button>
          <button 
            className={`status-btn ${isNeedsReviewPrelim ? 'active needs-review' : ''}`}
            disabled
          >
            Needs Review
          </button>
        </div>
      </div>

      {/* CSV NOTES */}
      {csvNotes && (
        <div className="csv-notes-section">
          <label>Note:</label>
          <div className="csv-notes-content">{csvNotes}</div>
        </div>
      )}

      {/* DOCTOR ASSESSMENT */}
      <div className="test-result-row">
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

      {/* DOCTOR NOTES */}
      <div className="notes-section">
        <label>Doctor's Expert Review</label>
        <textarea
          placeholder="Add your professional notes..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows="4"
        />
      </div>
    </div>
  );
};

export default HeartSoundsSection;
