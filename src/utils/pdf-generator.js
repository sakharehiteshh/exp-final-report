import { jsPDF } from 'jspdf';

export const generatePatientReportPDF = (patient, doctorNotes, doctorAssessments) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Teal-Gray%20Heart%20and%20Lightning%20Bolt%20Logo-RI6bMbO0OgLLrQ7d73ASP0Ag9Lao8u.png';
  
  // Load and add logo
  const img = new Image();
  img.src = logoUrl;
  
  try {
    doc.addImage(img, 'PNG', 20, 10, 35, 35);
  } catch (e) {
    console.log('Logo not loaded');
  }

  // Header text next to logo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Express Heart Test', 60, 25);
  
  yPosition = 33;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Medical Report', 60, yPosition);
  
  yPosition = 40;
  doc.setFontSize(9);
  doc.text('(314) 248-4076 | expressheartcare@gmail.com', 60, yPosition);
  
  yPosition = 50;
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Patient Information
  yPosition += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information:', 20, yPosition);
  
  yPosition += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Name:', 20, yPosition);
  doc.text(patient.name || '', 45, yPosition);
  doc.text('Height:', 120, yPosition);
  doc.text(patient.height || '', 145, yPosition);
  
  yPosition += 5;
  doc.text('DOB:', 20, yPosition);
  doc.text(patient.dob || '', 45, yPosition);
  doc.text('Weight:', 120, yPosition);
  doc.text(patient.weight || '', 145, yPosition);
  
  yPosition += 5;
  doc.text('Gender:', 20, yPosition);
  doc.text(patient.gender || '', 45, yPosition);
  doc.text('BMI:', 120, yPosition);
  doc.text(patient.bmi || '', 145, yPosition);
  
  yPosition += 5;
  doc.text('Age:', 20, yPosition);
  doc.text(String(patient.age || ''), 45, yPosition);
  
  yPosition += 8;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Vital Signs
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Vital Signs:', 20, yPosition);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Blood Pressure:', 20, yPosition);
  doc.text(patient.bloodPressure || '', 50, yPosition);
  doc.text('Heart Rate:', 120, yPosition);
  doc.text(`${patient.heartRate || ''} bpm`, 145, yPosition);
  
  yPosition += 5;
  doc.text('O2:', 20, yPosition);
  doc.text(`${patient.o2 || ''}%`, 50, yPosition);
  
  if (doctorAssessments && doctorAssessments.vitals) {
    yPosition += 7;
    doc.setFont('helvetica', 'bold');
    const vitalStatus = doctorAssessments.vitals;
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(vitalStatus === 'Normal' ? 0 : 255, 0, 0);
    doc.text(vitalStatus, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.vitals) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const vitalLines = doc.splitTextToSize(doctorNotes.vitals, pageWidth - 40);
    doc.text(vitalLines, 20, yPosition);
    yPosition += vitalLines.length * 4;
  }
  
  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // EKG/ECG
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Electrocardiogram (EKG/ECG):', 20, yPosition);
  
  const ekgStatus = patient.ekgStatus === 'Normal' ? 'Normal' : 'Needs Review';
  doc.text('Result:', 140, yPosition);
  doc.setTextColor(ekgStatus === 'Normal' ? 0 : 255, 0, 0);
  doc.text(ekgStatus, 160, yPosition);
  doc.setTextColor(0, 0, 0);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  if (patient.ekgNotes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Note:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const ekgLines = doc.splitTextToSize(patient.ekgNotes, pageWidth - 40);
    doc.text(ekgLines, 20, yPosition);
    yPosition += ekgLines.length * 4;
  }
  
  if (doctorAssessments && doctorAssessments.ekg) {
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(doctorAssessments.ekg === 'Normal' ? 0 : 255, 0, 0);
    doc.text(doctorAssessments.ekg, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.ekg) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const ekgDoctorLines = doc.splitTextToSize(doctorNotes.ekg, pageWidth - 40);
    doc.text(ekgDoctorLines, 20, yPosition);
    yPosition += ekgDoctorLines.length * 4;
  }
  
  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Heart Sounds
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Heart Sounds Exam', 20, yPosition);
  
  const heartStatus = patient.heartSoundsStatus === 'Normal' ? 'Normal' : 'Needs Review';
  doc.text('Result:', 140, yPosition);
  doc.setTextColor(heartStatus === 'Normal' ? 0 : 255, 0, 0);
  doc.text(heartStatus, 160, yPosition);
  doc.setTextColor(0, 0, 0);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  if (patient.heartSoundsNotes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Note:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const heartLines = doc.splitTextToSize(patient.heartSoundsNotes, pageWidth - 40);
    doc.text(heartLines, 20, yPosition);
    yPosition += heartLines.length * 4;
  }
  
  if (doctorAssessments && doctorAssessments.heartSounds) {
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(doctorAssessments.heartSounds === 'Normal' ? 0 : 255, 0, 0);
    doc.text(doctorAssessments.heartSounds, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.heartSounds) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const heartDoctorLines = doc.splitTextToSize(doctorNotes.heartSounds, pageWidth - 40);
    doc.text(heartDoctorLines, 20, yPosition);
    yPosition += heartDoctorLines.length * 4;
  }
  
  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Fitness Test
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Fitness Test', 20, yPosition);
  
  const fitnessStatus = patient.fitnessTestStatus === 'Normal' ? 'Normal' : 'Needs Review';
  doc.text('Result:', 140, yPosition);
  doc.setTextColor(fitnessStatus === 'Normal' ? 0 : 255, 0, 0);
  doc.text(fitnessStatus, 160, yPosition);
  doc.setTextColor(0, 0, 0);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  if (patient.fitnessTestNotes) {
    doc.setFont('helvetica', 'bold');
    doc.text('Note:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const fitnessLines = doc.splitTextToSize(patient.fitnessTestNotes, pageWidth - 40);
    doc.text(fitnessLines, 20, yPosition);
    yPosition += fitnessLines.length * 4;
  }
  
  if (doctorAssessments && doctorAssessments.fitness) {
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(doctorAssessments.fitness === 'Normal' ? 0 : 255, 0, 0);
    doc.text(doctorAssessments.fitness, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.fitness) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const fitnessDoctorLines = doc.splitTextToSize(doctorNotes.fitness, pageWidth - 40);
    doc.text(fitnessDoctorLines, 20, yPosition);
    yPosition += fitnessDoctorLines.length * 4;
  }
  
  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Cholesterol
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Finger Stick Cholesterol Test:', 20, yPosition);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  if (patient.totalCholesterol) {
    doc.text(`Total Cholesterol: ${patient.totalCholesterol} mg/dL`, 20, yPosition);
    yPosition += 5;
  }
  if (patient.ldlCholesterol) {
    doc.text(`LDL Cholesterol: ${patient.ldlCholesterol} mg/dL`, 20, yPosition);
    yPosition += 5;
  }
  if (patient.hdlCholesterol) {
    doc.text(`HDL Cholesterol: ${patient.hdlCholesterol} mg/dL`, 20, yPosition);
    yPosition += 5;
  }
  if (patient.triglycerides) {
    doc.text(`Triglycerides: ${patient.triglycerides} mg/dL`, 20, yPosition);
    yPosition += 5;
  }
  
  if (doctorAssessments && doctorAssessments.cholesterol) {
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(doctorAssessments.cholesterol === 'Normal' ? 0 : 255, 0, 0);
    doc.text(doctorAssessments.cholesterol, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.cholesterol) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const cholLines = doc.splitTextToSize(doctorNotes.cholesterol, pageWidth - 40);
    doc.text(cholLines, 20, yPosition);
    yPosition += cholLines.length * 4;
  }
  
  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  // Heart Risk Score
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Heart Risk Score:', 20, yPosition);
  
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 0, 0);
  doc.text(patient.heartRiskScore || 'Not assessed', 20, yPosition);
  doc.setTextColor(0, 0, 0);
  
  if (doctorAssessments && doctorAssessments.heartRiskScore) {
    yPosition += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Assessment:', 20, yPosition);
    doc.setTextColor(doctorAssessments.heartRiskScore === 'Normal' ? 0 : 255, 0, 0);
    doc.text(doctorAssessments.heartRiskScore, 70, yPosition);
    doc.setTextColor(0, 0, 0);
  }
  
  if (doctorNotes.heartRiskScore) {
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor\'s Review:', 20, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    const riskLines = doc.splitTextToSize(doctorNotes.heartRiskScore, pageWidth - 40);
    doc.text(riskLines, 20, yPosition);
    yPosition += riskLines.length * 4;
  }

  

  return doc;
};
