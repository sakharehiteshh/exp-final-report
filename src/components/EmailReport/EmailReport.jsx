import React, { useState } from "react";
import html2canvas from "html2canvas";
import { generatePatientReportPDF } from "../../utils/pdf-generator";
import "./EmailReport.css";

/* Capture the Express Heart Score card as a PNG data-URL.
   The formula chip (.ehs-formula) is intentionally excluded. */
async function captureEHSCard() {
  const el = document.getElementById("ehs-card-capture");
  if (!el) return null;
  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      ignoreElements: (node) =>
        node.classList && node.classList.contains("ehs-formula"),
    });
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

const EmailReport = ({ patient, doctorNotes, doctorAssessments, holterStatus }) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    const ehsImage = await captureEHSCard();
    const blobUrl = generatePatientReportPDF(
      patient,
      doctorNotes,
      doctorAssessments,
      holterStatus,
      ehsImage
    );
    setIsGenerating(false);
    window.open(blobUrl, "_blank");
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    setIsSending(true);

    const ehsImage = await captureEHSCard();
    // ✅ Generate the SAME pdf that includes holterStatus + EHS graphic
    // (blobUrl will be used when backend email sending is implemented)
    generatePatientReportPDF(
      patient,
      doctorNotes,
      doctorAssessments,
      holterStatus,
      ehsImage
    );

    // If you later implement backend email sending,
    // capture the blobUrl above and POST it to your API.
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

          <button className="btn-secondary" onClick={handleGeneratePDF} disabled={isGenerating}>
            {isGenerating ? "Preparing PDF…" : "Generate Preliminary Report (PDF)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReport;
