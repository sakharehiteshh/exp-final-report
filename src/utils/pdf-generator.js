import jsPDF from "jspdf";
import { calculateExpressHeartScore } from "./calculateExpressHeartScore";

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
  let y = 14;

  /* ================= CORE HELPERS ================= */

  const ensureSpace = (h = 5) => {
    if (y + h > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const divider = () => {
    ensureSpace(4);
    doc.setDrawColor(200);
    doc.line(margin, y, right, y);
    y += 4;
  };

  const sectionTitle = (text) => {
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(text, margin, y);
    y += 2;
    divider();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
  };

  const row = (l1, v1, l2, v2) => {
    ensureSpace(5);
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
    y += 4.5;
  };

  const vitalsRow = (l1, v1, l2, v2) => {
    ensureSpace(5);
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
    y += 4.5;
  };

  const resultRow = (value) => {
    ensureSpace(5);
    doc.setFont("helvetica", "bold");
    doc.text("Assessment:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "Reviewed", margin + 45, y);
    y += 4.5;
  };

  const doctorNotesBlock = (text) => {
    if (!text) return;
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.text("Doctor's Notes:", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, right - margin - 12);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 3;
  };

  /* ================= HEADER ================= */

  const logo = require("../assets/expressheartcarelogo.png");
  const logoW = 28;
  const logoProps = doc.getImageProperties(logo);
  const logoH = (logoProps.height * logoW) / logoProps.width;

  doc.addImage(logo, "PNG", margin, y, logoW, logoH);

  const tx = margin + logoW + 10;
  const centerY = y + logoH / 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Express Heart Tests", tx, centerY - 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Final Cardiac Screening Report", tx, centerY + 3);

  doc.setFontSize(8.5);
  doc.text(
    "Email: expressheartcare@gmail.com | Contact: 314-248-4076",
    tx,
    centerY + 9
  );

  y += logoH + 5;
  divider();

  /* ================= EXPRESS HEART SCORE ================= */

  const ehs = calculateExpressHeartScore(patient);

  const gradeRGB = {
    ELITE:             [8,   145, 178],
    OPTIMAL:           [22,  163,  74],
    FAIR:              [217, 119,   6],
    'ACTION REQUIRED': [220,  38,  38],
  };
  const gradeDesc = {
    ELITE:             'Peak cardiovascular efficiency.',
    OPTIMAL:           'Strong heart health; low risk profile.',
    FAIR:              'Functional, but with identified areas for optimization.',
    'ACTION REQUIRED': 'Significant indicators found; requires immediate cardiology consultation.',
  };
  const ehsScale = [
    { range: '90 – 100', label: 'ELITE',           color: [8,   145, 178], meaning: 'Peak cardiovascular efficiency' },
    { range: '80 – 89',  label: 'OPTIMAL',         color: [22,  163,  74], meaning: 'Strong heart health; low risk profile' },
    { range: '70 – 79',  label: 'FAIR',            color: [217, 119,   6], meaning: 'Functional, with areas for optimization' },
    { range: 'Below 70',      label: 'ACTION REQUIRED', color: [220,  38,  38], meaning: 'Significant indicators; cardiology consult' },
  ];

  const [er, eg, eb] = gradeRGB[ehs.grade];

  ensureSpace(72);

  // ── Colored header bar ──
  doc.setFillColor(er, eg, eb);
  doc.rect(margin, y, right - margin, 13, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('EXPRESS HEART SCORE', margin + 4, y + 9);
  doc.setFontSize(14);
  doc.text(`${ehs.total} / 100`, right - 4, y + 9, { align: 'right' });
  y += 13;

  // ── Grade sub-bar (tinted) ──
  const lR = Math.min(255, er + 200);
  const lG = Math.min(255, eg + 200);
  const lB = Math.min(255, eb + 200);
  doc.setFillColor(lR, lG, lB);
  doc.rect(margin, y, right - margin, 12, 'F');
  doc.setTextColor(er, eg, eb);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(ehs.grade, margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(gradeDesc[ehs.grade], margin + 4, y + 10.5);
  y += 12;

  // ── Grading Scale Table ──
  doc.setTextColor(0, 0, 0);
  y += 3;

  // Table column x-positions
  const colX = [margin + 3, margin + 38, margin + 92];
  const rowH  = 7.5;

  // Header row
  ensureSpace(rowH + 1);
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, right - margin, rowH, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.text('SCORE RANGE',    colX[0], y + 5);
  doc.text('STATUS',         colX[1], y + 5);
  doc.text('CLINICAL MEANING', colX[2], y + 5);
  y += rowH;

  // Data rows
  for (const row of ehsScale) {
    ensureSpace(rowH + 1);
    const isActive   = ehs.grade === row.label;
    const [rr, rg, rb] = row.color;

    if (isActive) {
      // Light tinted background
      doc.setFillColor(
        Math.min(255, rr + 195),
        Math.min(255, rg + 195),
        Math.min(255, rb + 195)
      );
      doc.rect(margin, y, right - margin, rowH, 'F');
      // Left accent strip
      doc.setFillColor(rr, rg, rb);
      doc.rect(margin, y, 3, rowH, 'F');
    }

    // Score range
    doc.setFont('helvetica', isActive ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(isActive ? rr : 70, isActive ? rg : 70, isActive ? rb : 70);
    doc.text(row.range, colX[0], y + 5);

    // Status label (always in grade colour)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rr, rg, rb);
    doc.text(row.label, colX[1], y + 5);

    // Clinical meaning
    doc.setFont('helvetica', isActive ? 'bold' : 'normal');
    doc.setTextColor(isActive ? 30 : 90, isActive ? 30 : 90, isActive ? 30 : 90);
    doc.text(row.meaning, colX[2], y + 5);

    y += rowH;
  }

  y += 2;

  // reset colours / style
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(200);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  y += 2;
  divider();

  /* ================= PATIENT INFORMATION ================= */

  sectionTitle("Patient Information");
  row("Name", patient.name, "Height", patient.height);
  row("DOB", patient.dob, "Weight", patient.weight ? `${patient.weight} lbs` : "—");
  row("Gender", patient.gender, "BMI", patient.bmi);
  row("Age", patient.age);
  divider();

  /* ================= PATIENT-REPORTED: SYMPTOMS & QUESTIONS ================= */

  if (patient.symptoms || patient.questions) {
    sectionTitle("Patient-Reported Information");
    if (patient.symptoms) {
      ensureSpace(5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Symptoms / Complaints:", margin, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      const symLines = doc.splitTextToSize(patient.symptoms, right - margin - 8);
      doc.text(symLines, margin + 8, y);
      y += symLines.length * 5 + 3;
    }
    if (patient.questions) {
      ensureSpace(5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Patient Questions:", margin, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      const qLines = doc.splitTextToSize(patient.questions, right - margin - 8);
      doc.text(qLines, margin + 8, y);
      y += qLines.length * 5 + 3;
    }
    divider();
  }

  /* ================= HEART RISK SCORE (at top) ================= */

  sectionTitle("Heart Risk Score (Abbott ASCVD / Framingham 10-yr)");
  const riskScore = patient.heartRiskScore ? `${patient.heartRiskScore}%` : "< 1%";
  const riskNum = parseFloat(patient.heartRiskScore);
  const riskLabel =
    isNaN(riskNum) || !patient.heartRiskScore
      ? "Low"
      : riskNum < 7.5
      ? "Low"
      : riskNum < 20
      ? "Intermediate"
      : "High";
  ensureSpace(5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("10-yr Risk Score:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${riskScore}  —  ${riskLabel} Risk`, margin + 45, y);
  y += 4.5;
  resultRow(doctorAssessments.heartRiskScore);
  doctorNotesBlock(doctorNotes.heartRiskScore);
  divider();

  /* ================= VITAL SIGNS ================= */

  sectionTitle("Vital Signs");
  vitalsRow(
    "Blood Pressure",
    patient.bloodPressure,
    "Heart Rate",
    patient.heartRate ? `${patient.heartRate} bpm` : "—"
  );
  vitalsRow("Oxygen Saturation", patient.o2 ? `${patient.o2}%` : "—");
  y += 1;
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
  row(
    "30sSTS / VO2 Max",
    `${patient.sitStandCount || "—"} / ${patient.vo2Max || "—"}`,
    "Category",
    patient.functionalCategory
  );
  doctorNotesBlock(doctorNotes.fitness);
  divider();

  /* ================= CHOLESTEROL ================= */

  sectionTitle("Finger Stick Cholesterol Test");
  row(
    "Total Cholesterol",
    patient.totalCholesterol ? `${patient.totalCholesterol} mg/dL` : "—",
    "LDL",
    patient.ldlCholesterol ? `${patient.ldlCholesterol} mg/dL` : "—"
  );
  row(
    "HDL",
    patient.hdlCholesterol ? `${patient.hdlCholesterol} mg/dL` : "—",
    "Triglycerides",
    patient.triglycerides ? `${patient.triglycerides} mg/dL` : "—"
  );
  row(
    "Glucose",
    patient.glucose ? `${patient.glucose} mg/dL` : "—",
    "Assessment",
    doctorAssessments.cholesterol
  );
  doctorNotesBlock(doctorNotes.cholesterol);
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

  /* ================= DISCLAIMER ================= */

  ensureSpace(14);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  const disclaimerText =
    "DISCLAIMER: This report is for informational purposes only and does not constitute a medical diagnosis or treatment plan. " +
    "Results should be reviewed and interpreted by a licensed physician in the context of the patient's complete medical history.";
  const discLines = doc.splitTextToSize(disclaimerText, right - margin);
  doc.text(discLines, margin, y);
  y += discLines.length * 4.5 + 3;

  /* ================= SIGNATURE ================= */

  ensureSpace(14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Physician Signature", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("e-signed by Dr. Gurav", margin, y);

  return URL.createObjectURL(doc.output("blob"));
}
