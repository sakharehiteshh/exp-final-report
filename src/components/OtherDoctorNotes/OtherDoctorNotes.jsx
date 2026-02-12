"use client"
import "../TestSection.css"

const OtherDoctorNotes = ({ notes, onNotesChange }) => {
  return (
    <div className="section-container">
      <h2 className="section-title">Other Doctor Notes</h2>
      <p className="section-subtitle">Additional observations and recommendations</p>

      <div className="notes-section">
        <label>Notes</label>
        <textarea
          placeholder="Add any additional notes, observations, or recommendations..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows="6"
        />
      </div>
    </div>
  )
}

export default OtherDoctorNotes
