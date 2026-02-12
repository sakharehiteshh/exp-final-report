import React, { useState } from "react";
import { generatePatientReportPDF } from "../../utils/pdf-generator";
import "./EmailReport.css";

const EmailReport = ({ patient, doctorNotes, doctorAssessments, holterStatus }) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleGeneratePDF = () => {
    const blobUrl = generatePatientReportPDF(
      patient,
      doctorNotes,
      doctorAssessments,
      holterStatus
    );

    window.open(blobUrl, "_blank");
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    setIsSending(true);

    // ✅ Generate the SAME pdf that includes holterStatus
    const blobUrl = generatePatientReportPDF(
      patient,
      doctorNotes,
      doctorAssessments,
      holterStatus
    );

    // If you later implement backend email sending,
    // you can fetch the blob from blobUrl and POST it.
    // For now, this mock just confirms.
    setTimeout(() => {
      alert(
        `Report would be sent to: ${email}\n\nNote: Email functionality requires backend implementation`
      );
      setIsSending(false);
      setEmail("");
    }, 1500);
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Email Report</h2>
      <p className="section-subtitle">Send the Final report via email</p>

      <div className="email-form">
        <label>Recipient Email Address</label>
        <input
          type="email"
          placeholder="Enter email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={handleSendEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Report via Email"}
          </button>

          <button className="btn-secondary" onClick={handleGeneratePDF}>
            Generate Preliminary Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReport;
