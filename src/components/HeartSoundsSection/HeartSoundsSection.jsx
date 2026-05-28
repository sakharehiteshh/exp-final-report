import React from 'react';
import '../TestSection.css';

const AUSCULTATION_OPTIONS = [
  { key: 'Normal (No Murmur)',         cls: 'normal'       },
  { key: 'Innocent Murmur',            cls: 'moderate'     },
  { key: 'Structural Murmur / Low EF', cls: 'needs-review' },
];

const HeartSoundsSection = ({
  result, notes, csvNotes, onNotesChange,
  assessment, onAssessmentChange,
  auscultationClassification, onAuscultationChange,
}) => {
  const normalizedResult = (result || '').toLowerCase().trim();
  const isNormalPrelim = normalizedResult === 'normal';
  const isNeedsReviewPrelim =
    normalizedResult === 'needs review' || normalizedResult === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">Heart Sounds Exam</h2>
      <p className="section-subtitle">Auscultation examination results</p>

      {/* AUSCULTATION CLASSIFICATION — drives Express Heart Score */}
      <div className="test-result-row">
        <label>Auscultation Classification</label>
        <div className="status-buttons">
          {AUSCULTATION_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`status-btn selectable ${auscultationClassification === opt.key ? `active ${opt.cls}` : ''}`}
              onClick={() => onAuscultationChange(auscultationClassification === opt.key ? '' : opt.key)}
            >
              {opt.key}
            </button>
          ))}
        </div>
      </div>

      {/* PRELIM STATUS (read-only from CSV) */}
      <div className="test-result-row">
        <label>Status</label>
        <div className="status-buttons">
          <button className={`status-btn ${isNormalPrelim ? 'active normal' : ''}`} disabled>
            Normal
          </button>
          <button className={`status-btn ${isNeedsReviewPrelim ? 'active needs-review' : ''}`} disabled>
            Needs Review
          </button>
        </div>
      </div>

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
