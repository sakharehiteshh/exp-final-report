import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { generatePatientReportPDF } from '../../utils/pdf-generator';
import './EmailReport.css';

const EmailReport = ({ patient, doctorNotes, doctorAssessments }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleGeneratePDF = () => {
    const doc = generatePatientReportPDF(patient, doctorNotes, doctorAssessments);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setIsSending(true);
    
    const doc = generatePatientReportPDF(patient, doctorNotes, doctorAssessments);
    const pdfBlob = doc.output('blob');
    
    setTimeout(() => {
      alert(`Report would be sent to: ${email}\n\nNote: Email functionality requires backend implementation`);
      setIsSending(false);
      setEmail('');
    }, 1500);
  };





  return (
    <div className="section-container">
      <h2 className="section-title">Email Report</h2>
      <p className="section-subtitle">Send the preliminary report via email</p>
      
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
            {isSending ? 'Sending...' : 'Send Report via Email'}
          </button>
          

          <button 
            className="btn-secondary"
            onClick={handleGeneratePDF}
          >
            Generate Preliminary Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailReport;
