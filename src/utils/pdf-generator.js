import jsPDF from "jspdf";

export function generatePatientReportPDF(
  patient,
  doctorNotes = {},
  doctorAssessments = {}
) {
  const doc = new jsPDF({ format: "letter" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const right = pageWidth - margin;
  let y = 18;

  /* ================= CORE HELPERS ================= */

  const ensureSpace = (h = 6) => {
    if (y + h > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const divider = () => {
    ensureSpace(4);
    doc.setDrawColor(200);
    doc.line(margin, y, right, y);
    y += 6;
  };

  const sectionTitle = (text) => {
    ensureSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(text, margin, y);
    y += 4;
    divider();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const row = (l1, v1, l2, v2) => {
    ensureSpace(7);
    doc.setFont("helvetica", "bold");
    doc.text(`${l1}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(v1 || "—", margin + 45, y);

    if (l2) {
      doc.setFont("helvetica", "bold");
      doc.text(`${l2}:`, margin + 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(v2 || "—", margin + 150, y);
    }
    y += 7;
  };

  // ⬅ slightly taller rows only for Vital Signs
  const vitalsRow = (l1, v1, l2, v2) => {
    ensureSpace(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${l1}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(v1 || "—", margin + 45, y);

    if (l2) {
      doc.setFont("helvetica", "bold");
      doc.text(`${l2}:`, margin + 115, y);
      doc.setFont("helvetica", "normal");
      doc.text(v2 || "—", margin + 155, y);
    }
    y += 9;
  };

  const resultRow = (value) => {
    ensureSpace(7);
    doc.setFont("helvetica", "bold");
    doc.text("Result:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "Reviewed", margin + 45, y);
    y += 7;
  };

  const doctorNotesBlock = (text) => {
    if (!text) return;
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.text("Doctor’s Notes:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, right - margin - 12);
    doc.text(lines, margin + 8, y);
    y += lines.length * 6 + 4;
  };

  /* ================= HEADER ================= */

  const logo = require("../assets/expressheartcarelogo.png");
  const logoW = 32;
  const logoProps = doc.getImageProperties(logo);
  const logoH = (logoProps.height * logoW) / logoProps.width;

  doc.addImage(logo, "PNG", margin, y, logoW, logoH);

  const tx = margin + logoW + 12;
  const centerY = y + logoH / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Express Heart Tests", tx, centerY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Final Cardiac Screening Report", tx, centerY + 3);

  doc.setFontSize(9);
  doc.text(
    "Email: expressheartcare@gmail.com | Contact: 314-248-4076",
    tx,
    centerY + 10
  );

  y += logoH + 10;
  divider();

  /* ================= PATIENT INFORMATION ================= */

  sectionTitle("Patient Information");
  row("Name", patient.name, "Height", patient.height);
  row("DOB", patient.dob, "Weight", `${patient.weight} lbs`);
  row("Gender", patient.gender, "BMI", patient.bmi);
  row("Age", patient.age);
  divider();

  /* ================= VITAL SIGNS ================= */

  sectionTitle("Vital Signs");
  vitalsRow(
    "Blood Pressure",
    patient.bloodPressure,
    "Heart Rate",
    `${patient.heartRate} bpm`
  );
  vitalsRow("Oxygen Saturation", `${patient.o2}%`);
  y += 2; // small breathing space
  divider();

  /* ================= EKG ================= */

  sectionTitle("Electrocardiogram (EKG)");
  resultRow(doctorAssessments.ekg);
  doctorNotesBlock(doctorNotes.ekg);
  divider();

  /* ================= HEART SOUNDS ================= */

  sectionTitle("Heart Sounds Examination");
  resultRow(doctorAssessments.heartSounds);
  doctorNotesBlock(doctorNotes.heartSounds);
  divider();

  /* ================= FITNESS ================= */

  sectionTitle("Fitness Assessment");
  resultRow(doctorAssessments.fitness);
  row("30s Sit-to-Stand", patient.sitStandCount);
  row("Estimated VO2 Max", patient.vo2Max);
  row("Functional Category", patient.functionalCategory);
  doctorNotesBlock(doctorNotes.fitness);
  divider();

  /* ================= CHOLESTEROL ================= */

  sectionTitle("Finger Stick Cholesterol Test");
  row(
    "Total Cholesterol",
    `${patient.totalCholesterol} mg/dL`,
    "LDL",
    `${patient.ldlCholesterol} mg/dL`
  );
  row(
    "HDL",
    `${patient.hdlCholesterol} mg/dL`,
    "Triglycerides",
    `${patient.triglycerides} mg/dL`
  );
  row(
    "Glucose",
    `${patient.glucose} mg/dL`,
    "Status",
    doctorAssessments.cholesterol
  );
  doctorNotesBlock(doctorNotes.cholesterol);
  divider();

  /* ================= HEART RISK SCORE ================= */

  sectionTitle("Heart Risk Score");
  resultRow(patient.heartRiskScore + "%" || "NA");
  doctorNotesBlock(doctorNotes.heartRiskScore);
  divider();

  /* ================= HOLTER MONITOR ================= */
  sectionTitle("Holter Monitor");
  resultRow(doctorAssessments.holterMonitor);
  doctorNotesBlock(doctorNotes.holterMonitor);
  divider();

  /* ================= OTHER DOCTOR NOTES ================= */
  sectionTitle("Other Doctor Notes");
  doctorNotesBlock(doctorNotes.otherNotes); 
  divider();
  /* ================= SIGNATURE ================= */

  ensureSpace(18);
  doc.setFont("helvetica", "bold");
  doc.text("Physician Signature", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("e-signed by Dr. Gurav", margin, y);

  return URL.createObjectURL(doc.output("blob"));
}
