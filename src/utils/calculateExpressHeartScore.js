/* ============================================================
   Express Heart Score — 5-Pillar Calculation
   Max: 100 pts  (20 + 25 + 25 + 15 + 15)
   ============================================================ */

// 1. Framingham Baseline — max 20 pts
function scoreFramingham(heartRiskScore) {
  if (!heartRiskScore) return { score: 20, max: 20, detail: 'Low Risk (<10%)' };
  const val = parseFloat(heartRiskScore);
  if (isNaN(val) || val < 10) return { score: 20, max: 20, detail: 'Low Risk (<10%)' };
  if (val <= 20)              return { score: 10, max: 20, detail: 'Intermediate Risk (10–20%)' };
  return                             { score: 0,  max: 20, detail: 'High Risk (>20%)' };
}

// 2. EKG Rhythm Precision — max 25 pts
function scoreEKG(ekgStatus, ekgNotes) {
  const s = (ekgStatus  || '').toLowerCase().trim();
  const n = (ekgNotes   || '').toLowerCase();

  const severe   = ['fibrillation', 'flutter', 'pvc', 'premature ventricular',
                    'heart block', 'infarct', 'ischemi', 'v-tach', 'vtach', 'svt'];
  const moderate = ['tachycardia', 'bradycardia', 'arrhythmia', 'irregul'];

  if (severe.some(p => n.includes(p)))
    return { score: 0,  max: 25, detail: 'AFib / PVCs / Other' };
  if (moderate.some(p => n.includes(p)))
    return { score: 15, max: 25, detail: 'Sinus Tachycardia / Bradycardia' };
  if (s === 'normal')
    return { score: 25, max: 25, detail: 'Normal Sinus Rhythm' };
  if (s.includes('review') || s.includes('abnormal'))
    return { score: 15, max: 25, detail: 'Needs Further Review' };
  return   { score: 25, max: 25, detail: 'Normal Sinus Rhythm' };
}

// 3. Acoustic & Structural Integrity — max 25 pts
function scoreAcoustic(heartSoundsStatus, heartSoundsNotes) {
  const s = (heartSoundsStatus || '').toLowerCase().trim();
  const n = (heartSoundsNotes  || '').toLowerCase();

  const severe   = ['structural', 'low ef', 'pathological', 'stenosis',
                    'regurgitation', 'reduced ejection', 'heart failure'];
  const innocent = ['innocent', 'benign', 'functional murmur', 'physiological'];

  if (severe.some(p => n.includes(p)))
    return { score: 0,  max: 25, detail: 'Structural Murmur / Low EF' };
  if (innocent.some(p => n.includes(p)) || (n.includes('murmur') && !severe.some(p => n.includes(p))))
    return { score: 10, max: 25, detail: 'Suspected Innocent Murmur' };
  if (s === 'normal')
    return { score: 25, max: 25, detail: 'Normal Heart Sounds' };
  if (s.includes('review') || s.includes('abnormal'))
    return { score: 10, max: 25, detail: 'Needs Further Review' };
  return   { score: 25, max: 25, detail: 'Normal Heart Sounds' };
}

// 4. Metabolic Power (VO₂ Max) — max 15 pts
function scoreMetabolic(functionalCategory, vo2Max) {
  const cat = (functionalCategory || '').toLowerCase();

  if (cat.includes('elite') || cat.includes('superior') || cat.includes('excellent') || cat.includes('above'))
    return { score: 15, max: 15, detail: 'Elite / Excellent' };
  if (cat.includes('good') || cat.includes('average') || cat.includes('fair'))
    return { score: 8,  max: 15, detail: 'Good / Fair' };
  if (cat.includes('poor') || cat.includes('below') || cat.includes('very poor'))
    return { score: 0,  max: 15, detail: 'Poor' };

  // Fallback: raw VO₂ Max value
  const vo2 = parseFloat(vo2Max);
  if (!isNaN(vo2)) {
    if (vo2 >= 42) return { score: 15, max: 15, detail: 'Elite / Excellent' };
    if (vo2 >= 28) return { score: 8,  max: 15, detail: 'Good / Fair' };
    return               { score: 0,  max: 15, detail: 'Poor' };
  }

  return { score: 8, max: 15, detail: 'Category Not Specified' };
}

// 5. Hemodynamic Stability — max 15 pts
function scoreHemodynamic(bloodPressure, heartRate) {
  const hr  = parseFloat(heartRate);
  let sys = null, dia = null;

  if (bloodPressure) {
    const m = bloodPressure.toString().replace(/\s/g, '').match(/(\d+)[-/](\d+)/);
    if (m) { sys = parseFloat(m[1]); dia = parseFloat(m[2]); }
  }

  // Stage 2 / arrhythmia range → 0 pts
  if ((sys !== null && sys >= 140) ||
      (dia !== null && dia >= 90)  ||
      (!isNaN(hr) && (hr < 50 || hr >= 100)))
    return { score: 0,  max: 15, detail: 'Stage 2 Hypertension / Arrhythmia' };

  // Optimal: BP <120/80 AND HR 60–80 → 15 pts
  if (sys !== null && dia !== null && sys < 120 && dia < 80 &&
      !isNaN(hr) && hr >= 60 && hr <= 80)
    return { score: 15, max: 15, detail: 'Optimal BP & Heart Rate' };

  // BP optimal but HR not checked
  if (sys !== null && dia !== null && sys < 120 && dia < 80)
    return { score: 15, max: 15, detail: 'Optimal Blood Pressure' };

  // Elevated / Stage 1 → 7 pts
  return { score: 7, max: 15, detail: 'Elevated / Stage 1 Hypertension' };
}

/* ── Main export ── */
export function calculateExpressHeartScore(patient) {
  if (!patient) {
    return { total: 0, grade: 'ACTION REQUIRED', pillars: {} };
  }

  const framingham  = scoreFramingham(patient.heartRiskScore);
  const ekg         = scoreEKG(patient.ekgStatus, patient.ekgNotes);
  const acoustic    = scoreAcoustic(patient.heartSoundsStatus, patient.heartSoundsNotes);
  const metabolic   = scoreMetabolic(patient.functionalCategory, patient.vo2Max);
  const hemodynamic = scoreHemodynamic(patient.bloodPressure, patient.heartRate);

  const total = framingham.score + ekg.score + acoustic.score +
                metabolic.score  + hemodynamic.score;

  const grade =
    total >= 90 ? 'ELITE'            :
    total >= 80 ? 'OPTIMAL'          :
    total >= 70 ? 'FAIR'             :
                  'ACTION REQUIRED';

  return { total, grade, pillars: { framingham, ekg, acoustic, metabolic, hemodynamic } };
}
