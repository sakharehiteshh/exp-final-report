import React from 'react';
import './ExpressHeartScore.css';
import { calculateExpressHeartScore } from '../../utils/calculateExpressHeartScore';

/* ── Grade config ── */
const GRADE = {
  ELITE:            { color: '#0891b2', light: '#ecfeff', border: '#0891b2', emoji: '🏆', desc: 'Peak cardiovascular efficiency.' },
  OPTIMAL:          { color: '#16a34a', light: '#f0fdf4', border: '#22c55e', emoji: '✅', desc: 'Strong heart health; low risk profile.' },
  FAIR:             { color: '#d97706', light: '#fffbeb', border: '#f59e0b', emoji: '⚠️', desc: 'Functional, but with identified areas for optimization.' },
  'ACTION REQUIRED':{ color: '#dc2626', light: '#fef2f2', border: '#ef4444', emoji: '🚨', desc: 'Significant indicators found; requires immediate cardiology consultation.' },
};

/* ── Grading scale rows ── */
const GRADING_SCALE = [
  { range: '90 – 100', label: 'ELITE',           color: '#0891b2', meaning: 'Peak cardiovascular efficiency' },
  { range: '80 – 89',  label: 'OPTIMAL',         color: '#16a34a', meaning: 'Strong heart health; low risk profile' },
  { range: '70 – 79',  label: 'FAIR',            color: '#d97706', meaning: 'Functional, with identified areas for optimization' },
  { range: 'Below 70', label: 'ACTION REQUIRED', color: '#dc2626', meaning: 'Significant indicators; immediate cardiology consult' },
];

/* ── Zone-colored semicircle gauge ── */
function GaugeMeter({ score, color }) {
  const cx = 130, cy = 116, R = 80, Rz = 98;
  const C       = Math.PI * R;
  const clamped = Math.max(0, Math.min(100, score));
  const filled  = (clamped / 100) * C;
  const gap     = C - filled;

  /* Point at fraction f (0=left, 1=right) along the semicircle at radius r */
  const pt = (f, r) => ({
    x: cx + r * Math.cos(Math.PI * (1 - f)),
    y: cy - r * Math.sin(Math.PI * (1 - f)),
  });

  /* SVG arc path from fraction f1 to f2 at radius r (always minor arc within semicircle) */
  const arcD = (f1, f2, r) => {
    const p1 = pt(f1, r), p2 = pt(f2, r);
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  };

  /* Full background / score arc */
  const bgPath = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;

  /* Endpoint dot position (only when score is between 0 and 100) */
  const ep = clamped > 0 && clamped < 100 ? pt(clamped / 100, R) : null;

  /* Zone boundary tick label positions */
  const tickData = [
    { f: 0.70, lbl: '70' },
    { f: 0.80, lbl: '80' },
    { f: 0.90, lbl: '90' },
  ];

  return (
    <svg viewBox="0 0 260 130" className="gauge-svg"
         aria-label={`Express Heart Score: ${score} out of 100`}>

      {/* ── Outer zone colour bands ── */}
      <path d={arcD(0,    0.70, Rz)} fill="none" stroke="#fca5a5" strokeWidth="11" strokeLinecap="butt"/>
      <path d={arcD(0.70, 0.80, Rz)} fill="none" stroke="#fcd34d" strokeWidth="11" strokeLinecap="butt"/>
      <path d={arcD(0.80, 0.90, Rz)} fill="none" stroke="#86efac" strokeWidth="11" strokeLinecap="butt"/>
      <path d={arcD(0.90, 1.00, Rz)} fill="none" stroke="#22c55e" strokeWidth="11" strokeLinecap="butt"/>

      {/* ── Zone boundary tick marks ── */}
      {tickData.map(({ f }) => {
        const pi = pt(f, R - 7);
        const po = pt(f, Rz + 7);
        return (
          <line key={f}
                x1={pi.x.toFixed(2)} y1={pi.y.toFixed(2)}
                x2={po.x.toFixed(2)} y2={po.y.toFixed(2)}
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        );
      })}

      {/* ── Zone boundary labels ── */}
      {tickData.map(({ f, lbl }) => {
        const tp = pt(f, Rz + 17);
        return (
          <text key={f}
                x={tp.x.toFixed(2)} y={tp.y.toFixed(2)}
                textAnchor="middle" fontSize="9" fill="#9ca3af"
                fontFamily="Arial, Helvetica, sans-serif">{lbl}</text>
        );
      })}

      {/* ── Background track ── */}
      <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth="15" strokeLinecap="round"/>

      {/* ── Score fill arc ── */}
      <path d={bgPath} fill="none" stroke={color} strokeWidth="15" strokeLinecap="round"
            strokeDasharray={`${filled.toFixed(2)} ${gap.toFixed(2)}`}/>

      {/* ── Score endpoint dot ── */}
      {ep && (
        <circle cx={ep.x.toFixed(2)} cy={ep.y.toFixed(2)} r="7"
                fill={color} stroke="white" strokeWidth="2"/>
      )}

      {/* ── Centre score number ── */}
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize="46" fontWeight="bold"
            fill={color} fontFamily="Arial, Helvetica, sans-serif">{score}</text>
      <text x={cx} y={cy + 3}  textAnchor="middle" fontSize="11" fill="#9ca3af"
            fontFamily="Arial, Helvetica, sans-serif">out of 100</text>
    </svg>
  );
}

/* ── Main component ── */
const ExpressHeartScore = ({ patient }) => {
  const { total, grade } = calculateExpressHeartScore(patient);
  const cfg = GRADE[grade];

  return (
    <div
      className="section-container ehs-card"
      style={{ borderLeft: `5px solid ${cfg.border}`, background: cfg.light }}
    >
      {/* ── Card header ── */}
      <div className="ehs-card-header">
        <div>
          <h2 className="section-title ehs-title" style={{ color: cfg.color }}>
            ♥ Express Heart Score™
          </h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Composite of 5 clinical pillars · Maximum 100 pts
          </p>
        </div>
        <div className="ehs-formula">
          S&nbsp;=&nbsp;W<sub>F</sub>&nbsp;+&nbsp;W<sub>E</sub>&nbsp;+&nbsp;W<sub>A</sub>&nbsp;+&nbsp;W<sub>V</sub>&nbsp;+&nbsp;W<sub>B</sub>
        </div>
      </div>

      {/* ── Two-column: gauge left, grading scale right ── */}
      <div className="ehs-main-layout">

        {/* Left — gauge + grade badge */}
        <div className="ehs-gauge-col">
          <GaugeMeter score={total} color={cfg.color} />
          <div className="ehs-grade-badge" style={{ background: cfg.color }}>
            {cfg.emoji}&nbsp;&nbsp;{grade}
          </div>
          <p className="ehs-grade-desc" style={{ color: cfg.color }}>
            {cfg.desc}
          </p>
        </div>

        {/* Right — grading scale table */}
        <div className="ehs-scale-col">
          <p className="ehs-scale-heading">Express Heart Score™ Grading Scale</p>
          <table className="ehs-scale-table">
            <thead>
              <tr>
                <th>Score Range</th>
                <th>Status</th>
                <th>Clinical Meaning</th>
              </tr>
            </thead>
            <tbody>
              {GRADING_SCALE.map(row => {
                const active = grade === row.label;
                return (
                  <tr
                    key={row.label}
                    className={`ehs-scale-row${active ? ' ehs-scale-row-active' : ''}`}
                    style={active ? { borderLeft: `4px solid ${row.color}` } : {}}
                  >
                    <td className="ehs-scale-range"
                        style={active ? { color: row.color, fontWeight: 700 } : {}}>
                      {row.range}
                    </td>
                    <td>
                      <span
                        className="ehs-scale-badge"
                        style={{
                          background: active ? row.color : `${row.color}22`,
                          color: active ? '#fff' : row.color,
                        }}
                      >
                        {row.label}
                      </span>
                    </td>
                    <td className="ehs-scale-meaning"
                        style={active ? { fontWeight: 600, color: '#1f2937' } : {}}>
                      {row.meaning}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ExpressHeartScore;
