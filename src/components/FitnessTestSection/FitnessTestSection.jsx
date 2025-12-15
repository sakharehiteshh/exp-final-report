import React from 'react';
import '../TestSection.css';

const FitnessTestSection = ({
  result,
  fitnessNotes,
  sitStandCount,
  vo2Max,
  functionalCategory,
  notes,
  onNotesChange,
  assessment,
  onAssessmentChange,
}) => {
  const normalizedResult = (result || '').toLowerCase().trim();
  const isNormalPrelim = normalizedResult === 'normal';
  const isNeedsReviewPrelim =
    normalizedResult === 'needs review' || normalizedResult === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">Quick Fitness Test</h2>
      <p className="section-subtitle">
        30-second sit-to-stand (30sSTST) plus VO₂ max estimate
      </p>

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

      {/* CSV FITNESS DATA */}
      <div className="csv-notes-section">
        <label>30s Sit-to-Stand Count:</label>
        <div className="csv-notes-content">
          {sitStandCount || 'N/A'}
        </div>

        <label>Estimated VO₂ Max:</label>
        <div className="csv-notes-content">
          {vo2Max || 'N/A'}
        </div>

        <label>Functional Category:</label>
        <div className="csv-notes-content">
          {functionalCategory || 'N/A'}
        </div>

        <label>Initial Notes:</label>
        <div className="csv-notes-content">
          {fitnessNotes || 'No notes from prelim exam'}
        </div>
      </div>

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

export default FitnessTestSection;
