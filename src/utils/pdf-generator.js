import jsPDF from "jspdf";

export function generatePatientReportPDF(
  patient,
  doctorNotes       = {},
  doctorAssessments = {},
  holterStatus      = "",
  ehsImageDataUrl   = null
) {
  const doc = new jsPDF({ format: "letter" });
  const PW  = doc.internal.pageSize.getWidth();   // 215.9 mm
  const PH  = doc.internal.pageSize.getHeight();  // 279.4 mm
  const M   = 16;
  const CW  = PW - 2 * M;   // ≈ 184 mm
  let   y   = 0;
  let   pg  = 1;

  /* ── Palette ── */
  const NAVY   = [15,  76, 117];
  const TEAL   = [8,  145, 178];
  const RED    = [185,  28,  28];
  const BLUE   = [29,  78, 216];
  const GRN    = [21, 128,  61];
  const AMBER  = [146,  64,  14];
  const THEAD  = [226, 234, 244];   // table header bg
  const TROW   = [246, 249, 253];   // alt row bg
  const BDCLR  = [188, 204, 222];   // border colour
  const LAB    = [82, 104, 130];    // label grey
  const BODY   = [22,  38,  60];    // main text
  const WHITE  = [255, 255, 255];
  const YLWBG  = [255, 252, 218];
  const YLWBD  = [196, 154,  20];

  /* ── Micro helpers ── */
  const C   = (...rgb) => doc.setTextColor(...rgb);
  const F   = (...rgb) => doc.setFillColor(...rgb);
  const DR  = (...rgb) => doc.setDrawColor(...rgb);
  const LW  = (n)      => doc.setLineWidth(n);
  const FNT = (s, sz)  => { doc.setFont("helvetica", s); if (sz !== undefined) doc.setFontSize(sz); };
  const T   = (str, x, yy, o) => doc.text(String(str ?? "—"), x, yy, o ?? {});
  const clip= (val, n = 38)   => { const s = String(val ?? "—"); return s.length > n ? s.slice(0, n-1) + "…" : s; };

  /* ════════════════════════════════════════════
     FOOTER
  ════════════════════════════════════════════ */
  function drawFooter() {
    F(...NAVY);  doc.rect(0, PH - 10, PW, 10,  "F");
    F(...TEAL);  doc.rect(0, PH - 1.8, PW, 1.8, "F");
    FNT("normal", 7); C(...WHITE);
    T(patient.name || "—",  M, PH - 4.5);
    T("Express Heart Tests  |  expressheartcare@gmail.com  |  (314) 248-4076",
      PW / 2, PH - 4.5, { align: "center" });
    T(`Page ${pg}`, PW - M, PH - 4.5, { align: "right" });
  }

  /* ════════════════════════════════════════════
     MINI HEADER (pages 2 +)
  ════════════════════════════════════════════ */
  function drawMiniHeader() {
    F(...TEAL); doc.rect(0, 0, PW, 1.5, "F");
    FNT("bold", 8); C(...NAVY);
    T("EXPRESS HEART TESTS  —  Final Cardiac Screening Report", M, 9.5);
    FNT("normal", 7.5); C(...LAB);
    T(`${patient.name || "—"}   |   DOB: ${patient.dob || "—"}`, PW - M, 9.5, { align: "right" });
    DR(...BDCLR); LW(0.4);
    doc.line(M, 12, PW - M, 12);
    y = 17;
  }

  /* ════════════════════════════════════════════
     ENSURE SPACE
  ════════════════════════════════════════════ */
  function need(h) {
    if (y + h > PH - 14) {
      drawFooter();
      doc.addPage();
      pg++;
      drawMiniHeader();
    }
  }

  /* ════════════════════════════════════════════
     SECTION HEADER  – left teal bar + bold title + rule
  ════════════════════════════════════════════ */
  function secHead(label) {
    need(16);
    y += 4;
    F(...TEAL); doc.rect(M, y - 1, 3.5, 9, "F");
    FNT("bold", 10); C(...NAVY);
    T(label, M + 7, y + 5.5);
    y += 9;
    DR(...TEAL); LW(0.5);
    doc.line(M, y, M + CW, y);
    y += 4;
    FNT("normal", 8.5); C(...BODY);
  }

  /* ════════════════════════════════════════════
     CLINICAL TABLE
     cols = [{ header, width(mm) }]
     rows = array of arrays; last col = flag string
  ════════════════════════════════════════════ */
  function clinTable(cols, rows) {
    const HDR_H = 7.5;
    const ROW_H = 7;
    const totalW = cols.reduce((s, c) => s + c.w, 0);

    need(HDR_H + rows.length * ROW_H + 4);

    /* header */
    F(...THEAD); DR(...BDCLR); LW(0.3);
    doc.rect(M, y, totalW, HDR_H, "FD");
    let cx = M;
    cols.forEach((col, i) => {
      FNT("bold", 7); C(...LAB);
      T(col.h.toUpperCase(), cx + 3, y + 5.5);
      cx += col.w;
      if (i < cols.length - 1) { DR(...BDCLR); doc.line(cx, y, cx, y + HDR_H); }
    });
    y += HDR_H;

    /* rows */
    rows.forEach((row, ri) => {
      need(ROW_H + 1);
      if (ri % 2 === 1) { F(...TROW); doc.rect(M, y, totalW, ROW_H, "F"); }
      DR(...BDCLR); LW(0.2); doc.rect(M, y, totalW, ROW_H, "S");
      cx = M;
      cols.forEach((col, ci) => {
        if (ci < cols.length - 1) { DR(...BDCLR); doc.line(cx + col.w, y, cx + col.w, y + ROW_H); }
        const val   = row[ci] ?? "—";
        const isFlg = ci === cols.length - 1 && cols.length >= 3;

        if (isFlg) {
          const f = String(val).toUpperCase();
          const clr = f === "H" || f === "HIGH"   ? RED  :
                      f === "L" || f === "LOW"    ? BLUE :
                      f === "CRIT"                ? [120, 0, 0] : GRN;
          FNT("bold", 8); C(...clr);
          T(val, cx + col.w / 2, y + 5, { align: "center" });
        } else if (ci === 1) {
          /* result column — bold + coloured when flag is H/L */
          const flagVal = String(row[cols.length - 1] ?? "").toUpperCase();
          const clr = flagVal === "H" || flagVal === "HIGH"  ? RED  :
                      flagVal === "L" || flagVal === "LOW"   ? BLUE : BODY;
          const isBold = flagVal === "H" || flagVal === "HIGH" ||
                         flagVal === "L" || flagVal === "LOW";
          FNT(isBold ? "bold" : "normal", 8.5); C(...clr);
          T(clip(val, 28), cx + 3, y + 5);
        } else {
          FNT("normal", ci === 0 ? 8.5 : 8); C(...(ci === 2 ? LAB : BODY));
          T(clip(val, ci === 0 ? 35 : 28), cx + 3, y + 5);
        }
        cx += col.w;
      });
      y += ROW_H;
    });
    y += 5;
  }

  /* ════════════════════════════════════════════
     NOTE / ASSESSMENT BOX
  ════════════════════════════════════════════ */
  function noteBox(label, val) {
    if (!val) return;
    const wrapped = doc.splitTextToSize(String(val), CW - 54);
    const bh      = Math.max(9.5, wrapped.length * 5.2 + 8);
    need(bh + 3);
    DR(...BDCLR); LW(0.25); doc.rect(M, y, CW, bh, "S");
    DR(...TEAL);  LW(1.8);  doc.line(M, y + 0.9, M, y + bh - 0.9);
    LW(0.25);
    FNT("bold",   7.5); C(...LAB);    T(label, M + 7,  y + 6.5);
    FNT("normal", 8.5); C(...BODY);   doc.text(wrapped, M + 54, y + 6.5);
    y += bh + 3;
  }

  /* ════════════════════════════════════════════
     SIMPLE TWO-COLUMN INFO ROW
  ════════════════════════════════════════════ */
  let alt = false;
  const resetAlt = () => { alt = false; };
  function infoRow(l1, v1, l2, v2) {
    const h = 6.5; const half = M + CW / 2;
    need(h);
    alt = !alt;
    if (alt) { F(...TROW); doc.rect(M, y, CW, h, "F"); }
    FNT("bold", 7.5); C(...LAB);
    T(`${l1}:`, M + 5, y + 4.8);
    FNT("normal", 8.5); C(...BODY);
    T(clip(v1), M + 52, y + 4.8);
    if (l2 !== undefined) {
      FNT("bold", 7.5); C(...LAB);
      T(`${l2}:`, half + 5, y + 4.8);
      FNT("normal", 8.5); C(...BODY);
      T(clip(v2), half + 52, y + 4.8);
    }
    y += h;
  }

  function noData(msg = "No data recorded for this visit.") {
    need(8);
    FNT("italic", 8); C(158, 174, 194);
    T(msg, M + 8, y + 5.5);
    y += 8;
    FNT("normal", 8.5); C(...BODY);
  }

  const gap = (n = 5) => { y += n; };

  /* ════════════════════════════════════════════
     FLAG HELPERS
  ════════════════════════════════════════════ */
  const bpFlag = (raw) => {
    const m = String(raw ?? "").match(/(\d+)[/\-](\d+)/);
    if (!m) return "—";
    const s = +m[1], d = +m[2];
    if (s >= 140 || d >= 90) return "H";
    if (s >= 130 || d >= 80) return "H";
    return "N";
  };
  const numFlag = (raw, lo, hi) => {
    const v = parseFloat(raw);
    if (isNaN(v))  return "—";
    if (lo !== null && v < lo) return "L";
    if (hi !== null && v > hi) return "H";
    return "N";
  };

  /* ════════════════════════════════════════════
     REPORT DATE
  ════════════════════════════════════════════ */
  const rptDate = patient.timestamp
    ? new Date(patient.timestamp).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });

  /* ════════════════════════════════════════════
     PAGE 1 — LETTERHEAD
  ════════════════════════════════════════════ */

  F(...TEAL); doc.rect(0, 0, PW, 2.5, "F");
  y = 5;

  const logo  = require("../assets/expressheartcarelogo.png");
  const logoW = 56;
  const lp    = doc.getImageProperties(logo);
  const logoH = (lp.height / lp.width) * logoW;
  doc.addImage(logo, "PNG", M, y, logoW, logoH);

  const tx = M + logoW + 8;
  FNT("bold", 15); C(...NAVY); T("Express Heart Tests", tx, y + logoH / 2 + 0.5);
  FNT("normal", 9); C(...LAB); T("Final Cardiac Screening Report", tx, y + logoH / 2 + 6);
  FNT("normal", 7.5); C(...LAB); T("expressheartcare@gmail.com  |  (314) 248-4076", tx, y + logoH / 2 + 11.5);

  FNT("normal", 7.5); C(...LAB);
  T(rptDate, PW - M, y + 5, { align: "right" });

  y = Math.max(y + logoH + 3, 34);
  DR(...BDCLR); LW(0.5); doc.line(M, y, PW - M, y); y += 6;

  /* ── Patient demographics box ── */
  const PIH = 20;
  F(238, 244, 251); DR(...BDCLR); LW(0.4);
  doc.rect(M, y, CW, PIH, "FD");
  /* top label strip */
  F(...NAVY); doc.rect(M, y, CW, 7, "F");
  FNT("bold", 7.5); C(...WHITE);
  T("PATIENT INFORMATION", M + 5, y + 5.2);
  T(`Visit Date: ${rptDate}`, PW - M - 5, y + 5.2, { align: "right" });
  y += 7;

  /* field grid — 4 columns: label | value | label | value */
  const pf = [
    ["Name",    patient.name   || "—", "Date of Birth", patient.dob    || "—"],
    ["Age",     patient.age    ? `${patient.age} yrs`   : "—",
     "Gender",  patient.gender || "—"],
  ];
  const half2 = M + CW / 2;
  pf.forEach((row, ri) => {
    const rowY = y + ri * ((PIH - 7) / pf.length);
    if (ri > 0) { DR(...BDCLR); LW(0.2); doc.line(M, rowY, PW - M, rowY); }
    FNT("bold",   7.5); C(...LAB);  T(`${row[0]}:`, M + 5,      rowY + 5.5);
    FNT("normal", 8.5); C(...BODY); T(row[1],        M + 35,     rowY + 5.5);
    FNT("bold",   7.5); C(...LAB);  T(`${row[2]}:`,  half2 + 5,  rowY + 5.5);
    FNT("normal", 8.5); C(...BODY); T(row[3],         half2 + 42, rowY + 5.5);
  });
  y += PIH - 7 + 7;

  /* ════════════════════════════════════════════
     EXPRESS HEART SCORE  (captured image)
  ════════════════════════════════════════════ */
  if (ehsImageDataUrl) {
    const ip = doc.getImageProperties(ehsImageDataUrl);
    let iw   = CW;
    let ih   = iw * ip.height / ip.width;
    if (ih > 88) { ih = 88; iw = ih * ip.width / ip.height; }
    const xOff = (CW - iw) / 2;
    need(ih + 8);
    DR(...BDCLR); LW(0.4); doc.rect(M + xOff, y, iw, ih, "S");
    doc.addImage(ehsImageDataUrl, "PNG", M + xOff, y, iw, ih);
    y += ih + 7;
  }

  /* ════════════════════════════════════════════
     SYMPTOMS & QUESTIONS
  ════════════════════════════════════════════ */
  if (patient.symptoms || patient.questions) {
    secHead("Patient-Reported Symptoms & Questions");
    if (patient.symptoms) noteBox("Symptoms / Complaints", patient.symptoms);
    if (patient.questions) noteBox("Patient Questions",    patient.questions);
    gap();
  }

  /* ════════════════════════════════════════════
     VITAL SIGNS
  ════════════════════════════════════════════ */
  secHead("Vital Signs");
  {
    clinTable(
      [{ h: "Measurement", w: 130 }, { h: "Result", w: 54 }],
      [
        ["Height",            patient.height || "—"],
        ["Weight",            patient.weight ? `${patient.weight} lbs` : "—"],
        ["BMI",               patient.bmi    ? String(patient.bmi)     : "—"],
        ["Blood Pressure",    patient.bloodPressure || "—"],
        ["Heart Rate",        patient.heartRate ? `${patient.heartRate} bpm` : "—"],
        ["Oxygen Saturation", patient.o2        ? `${patient.o2}%`     : "—"],
      ]
    );
    noteBox("Assessment",     doctorAssessments.vitals);
    noteBox("Doctor's Notes", doctorNotes.vitals);
  }
  gap();

  /* ════════════════════════════════════════════
     ELECTROCARDIOGRAM (EKG)
  ════════════════════════════════════════════ */
  secHead("Electrocardiogram (EKG)");
  resetAlt();
  if (patient.ekgStatus) infoRow("Preliminary Status", patient.ekgStatus);
  if (patient.ekgNotes)  noteBox("Preliminary Notes",  patient.ekgNotes);
  noteBox("Assessment",     doctorAssessments.ekg);
  noteBox("Doctor's Notes", doctorNotes.ekg);
  if (!patient.ekgStatus && !doctorAssessments.ekg && !doctorNotes.ekg)
    noData("EKG findings not yet recorded.");
  gap();

  /* ════════════════════════════════════════════
     HEART SOUNDS
  ════════════════════════════════════════════ */
  secHead("Heart Sounds Examination");
  resetAlt();
  if (patient.heartSoundsStatus) infoRow("Preliminary Status", patient.heartSoundsStatus);
  if (patient.heartSoundsNotes)  noteBox("Preliminary Notes",  patient.heartSoundsNotes);
  noteBox("Assessment",     doctorAssessments.heartSounds);
  noteBox("Doctor's Notes", doctorNotes.heartSounds);
  if (!patient.heartSoundsStatus && !doctorAssessments.heartSounds && !doctorNotes.heartSounds)
    noData("Heart sounds findings not yet recorded.");
  gap();

  /* ════════════════════════════════════════════
     FITNESS ASSESSMENT
  ════════════════════════════════════════════ */
  secHead("Fitness Assessment");
  {
    const sts = patient.sitStandCount  || "—";
    const vo2 = patient.vo2Max         || "—";
    const cat = patient.functionalCategory || "—";
    clinTable(
      [{ h: "Measurement", w: 130 }, { h: "Result", w: 54 }],
      [
        ["30-sec Sit-to-Stand (STS)", sts],
        ["Estimated VO2 Max",          vo2 !== "—" ? `${vo2} mL/kg/min` : "—"],
        ["Functional Category",        cat],
      ]
    );
    if (patient.fitnessNotes) noteBox("Preliminary Notes", patient.fitnessNotes);
    noteBox("Assessment",     doctorAssessments.fitness);
    noteBox("Doctor's Notes", doctorNotes.fitness);
  }
  gap();

  /* ════════════════════════════════════════════
     CHOLESTEROL PANEL
  ════════════════════════════════════════════ */
  secHead("Finger-Stick Cholesterol Panel");
  {
    const labCols = [
      { h: "Test",            w: 72 },
      { h: "Result",          w: 50 },
      { h: "Reference Range", w: 62 },
    ];
    const rows = [];
    if (patient.totalCholesterol)
      rows.push(["Total Cholesterol", `${patient.totalCholesterol} mg/dL`, "< 200 mg/dL"]);
    if (patient.ldlCholesterol)
      rows.push(["LDL Cholesterol",   `${patient.ldlCholesterol} mg/dL`,  "< 100 mg/dL"]);
    if (patient.hdlCholesterol)
      rows.push(["HDL Cholesterol",   `${patient.hdlCholesterol} mg/dL`,  ">= 40 (M) / >= 50 (F) mg/dL"]);
    if (patient.triglycerides)
      rows.push(["Triglycerides",     `${patient.triglycerides} mg/dL`,   "< 150 mg/dL"]);
    if (patient.glucose)
      rows.push(["Glucose",           `${patient.glucose} mg/dL`,         "70 – 99 mg/dL"]);

    if (rows.length) clinTable(labCols, rows);
    else noData("Cholesterol panel results not available.");

    if (patient.totalCholesterolNotes) noteBox("Preliminary Notes", patient.totalCholesterolNotes);
    noteBox("Assessment",     doctorAssessments.cholesterol);
    noteBox("Doctor's Notes", doctorNotes.cholesterol);
  }
  gap();

  /* ════════════════════════════════════════════
     CARDIOVASCULAR RISK ASSESSMENT
  ════════════════════════════════════════════ */
  secHead("Cardiovascular Risk Assessment  (Abbott ASCVD / Framingham 10-yr)");
  {
    const rn = parseFloat(patient.heartRiskScore);
    const rl = isNaN(rn) || !patient.heartRiskScore
      ? "Low" : rn < 7.5 ? "Low" : rn < 20 ? "Intermediate" : "High";
    clinTable(
      [
        { h: "Assessment",       w: 78 },
        { h: "10-yr Risk Score", w: 56 },
        { h: "Risk Category",    w: 50 },
      ],
      [["ASCVD / Framingham", patient.heartRiskScore ? `${patient.heartRiskScore}%` : "< 1%", rl]]
    );
    noteBox("Assessment",     doctorAssessments.heartRiskScore);
    noteBox("Doctor's Notes", doctorNotes.heartRiskScore);
  }
  gap();

  /* ════════════════════════════════════════════
     HOLTER MONITOR
  ════════════════════════════════════════════ */
  const hasHolter = holterStatus || doctorAssessments.holterMonitor || doctorNotes.holterMonitor;
  if (hasHolter) {
    secHead("Holter Monitor");
    resetAlt();
    if (holterStatus) infoRow("Status", holterStatus);
    noteBox("Assessment",     doctorAssessments.holterMonitor);
    noteBox("Doctor's Notes", doctorNotes.holterMonitor);
    gap();
  }

  /* ════════════════════════════════════════════
     ADDITIONAL CLINICAL NOTES
  ════════════════════════════════════════════ */
  if (doctorNotes.otherNotes) {
    secHead("Additional Clinical Notes");
    noteBox("Notes", doctorNotes.otherNotes);
    gap();
  }

  /* ════════════════════════════════════════════
     DISCLAIMER + SIGNATURE
     Anchored to bottom of the last page
  ════════════════════════════════════════════ */
  const DISC_H = 20;
  const SIG_H  = 20;
  const FOOT_CLR = 13;
  const TOTAL_BLK = DISC_H + SIG_H + 14;

  const anchorY = PH - FOOT_CLR - TOTAL_BLK;
  if (y < anchorY) {
    /* room to pull everything to the bottom — draw a subtle end-of-notes marker */
    DR(210, 220, 234); LW(0.4);
    doc.line(M + 20, y + 4, PW - M - 20, y + 4);
    FNT("italic", 7); C(190, 200, 215);
    T("— end of clinical findings —", PW / 2, y + 8, { align: "center" });
    y = anchorY;
  } else {
    need(TOTAL_BLK + 5);
    y = PH - FOOT_CLR - TOTAL_BLK;
  }

  /* thin rule */
  DR(...TEAL); LW(0.6); doc.line(M, y, PW - M, y); y += 5;

  /* disclaimer */
  // F(...YLWBG); DR(...YLWBD); LW(0.3);
  // doc.rect(M, y, CW, DISC_H, "FD");
  // F(192, 148, 10); doc.rect(M, y, 3.5, DISC_H, "F");
  // FNT("bold",   7.8); C(100, 62, 0); T("DISCLAIMER", M + 8, y + 7);
  // FNT("normal", 7.2); C(72,  50, 0);
  // const disc =
  //   "This report is for informational purposes only and does not constitute a medical " +
  //   "diagnosis or treatment plan. Results should be reviewed and interpreted by a licensed " +
  //   "physician in the context of the patient's complete medical history.";
  // doc.text(doc.splitTextToSize(disc, CW - 14), M + 8, y + 13);
  // y += DISC_H + 4;

  /* signature + date boxes */
  const hw = (CW - 6) / 2;

  F(248, 250, 254); DR(...BDCLR); LW(0.3);
  doc.rect(M, y, hw, SIG_H, "FD");
  F(...NAVY); doc.rect(M, y, hw, 6, "F");
  FNT("bold", 6.5); C(...WHITE); T("PHYSICIAN SIGNATURE", M + 6, y + 4.5);
  FNT("italic", 9.5); C(...BODY); T("e-signed by Dr. Gurav", M + 6, y + 14);
  FNT("italic", 9.5); C(...BODY); T(rptDate, M + 6, y + 18);

  // doc.rect(M + hw + 6, y, hw, SIG_H, "FD");
  // F(...NAVY); doc.rect(M + hw + 6, y, hw, 6, "F");
  // FNT("bold", 6.5); C(...WHITE); T("DATE OF REPORT", M + hw + 12, y + 4.5);
  // FNT("italic", 9.5); C(...BODY); T(rptDate, M + hw + 12, y + 15);

  /* ════════════════════════════════════════════
     FOOTER
  ════════════════════════════════════════════ */
  drawFooter();

  return URL.createObjectURL(doc.output("blob"));
}
