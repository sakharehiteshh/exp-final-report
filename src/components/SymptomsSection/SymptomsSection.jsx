import React from 'react';
import './SymptomsSection.css';

const SymptomsSection = ({ symptoms, questions }) => {
  const hasContent = symptoms || questions;

  if (!hasContent) return null;

  return (
    <div className="section-container symptoms-section">
      <h2 className="section-title">Patient-Reported Information</h2>
      <p className="section-subtitle">Symptoms and questions submitted by the patient</p>

      {symptoms && (
        <div className="symptom-block">
          <label className="symptom-label">
            <span className="symptom-icon">🩺</span> Symptoms / Complaints
          </label>
          <div className="symptom-content">{symptoms}</div>
        </div>
      )}

      {questions && (
        <div className="symptom-block">
          <label className="symptom-label">
            <span className="symptom-icon">❓</span> Patient Questions
          </label>
          <div className="symptom-content">{questions}</div>
        </div>
      )}
    </div>
  );
};

export default SymptomsSection;
