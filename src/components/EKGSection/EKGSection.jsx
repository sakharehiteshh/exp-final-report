import React from 'react';
import '../TestSection.css';

const RHYTHM_OPTIONS = [
  { key: 'Normal Sinus Rhythm',      cls: 'normal'       },
  { key: 'Sinus Tachy / Bradycardia', cls: 'moderate'    },
  { key: 'AFib / PVCs / Other',       cls: 'needs-review' },
];

const EKGSection = ({
  result, notes, csvNotes, onNotesChange,
  assessment, onAssessmentChange,
  rhythmClassification, onRhythmChange,
}) => {
  const normalizedResult = (result || '').toLowerCase().trim();
  const isNormalPrelim = normalizedResult === 'normal';
  const isNeedsReviewPrelim =
    normalizedResult === 'needs review' || normalizedResult === 'needs-review';

  return (
    <div className="section-container">
      <h2 className="section-title">EKG/ECG</h2>
      <p className="section-subtitle">Electrocardiogram results</p>

      {/* RHYTHM CLASSIFICATION — drives Express Heart Score */}
      <div className="test-result-row">
        <label>Rhythm Classification</label>
        <div className="status-buttons">
          {RHYTHM_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`status-btn selectable ${rhythmClassification === opt.key ? `active ${opt.cls}` : ''}`}
              onClick={() => onRhythmChange(rhythmClassification === opt.key ? '' : opt.key)}
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

      {/* DOCTOR'S ASSESSMENT */}
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

export default EKGSection;
