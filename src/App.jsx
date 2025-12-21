// src/App.jsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";

import PatientSelector from "./components/PatientSelector/PatientSelector";
import PatientDemographics from "./components/PatientDemographics/PatientDemographics";
import TestVitals from "./components/TestVitals/TestVitals";
import EKGSection from "./components/EKGSection/EKGSection";
import HeartSoundsSection from "./components/HeartSoundsSection/HeartSoundsSection";
import FitnessTestSection from "./components/FitnessTestSection/FitnessTestSection";
import CholesterolSection from "./components/CholesterolSection/CholesterolSection";
import HeartRiskScore from "./components/HeartRiskScore/HeartRiskScore";
import EmailReport from "./components/EmailReport/EmailReport";

import "./App.css";

import { fetchPatientsFromSheet } from "./utils/fetchPatientsFromSheet";
import { saveFinalReport } from "./utils/saveFinalReport";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [doctorNotes, setDoctorNotes] = useState({
    ekg: "",
    heartSounds: "",
    fitness: "",
    vitals: "",
    cholesterol: "",
    heartRiskScore: "",
  });

  const [doctorAssessments, setDoctorAssessments] = useState({
    ekg: "",
    heartSounds: "",
    fitness: "",
    vitals: "",
    cholesterol: "",
    heartRiskScore: "",
  });

  // Load prelim records from Google Sheets
  useEffect(() => {
    async function load() {
      try {
        const rows = await fetchPatientsFromSheet();
        console.log("RAW SHEET ROWS >>>", rows);
        if (rows && rows.length) {
          console.log("FIRST ROW >>>", rows[0]);
          console.log("ALL KEYS >>>", Object.keys(rows[0]));
        }

        const parsed = rows.map((p, idx) => ({
          id: idx + 1,

          // BASIC INFO
          timestamp: p["Timestamp"],
          name: p["Patient Name"],
          dob: p["Date of Birth"],
          age: p["Age"],
          gender: p["Gender"],
          height: p["Height"],
          weight: p["Weight (lbs)"],
          bmi: p["BMI"],
          bloodPressure: p["Blood Pressure"],
          o2: p["O2 Level (%)"],
          heartRate: p["Heart Rate (bpm)"],

          // EKG
          ekgStatus: p["EKG Status"],
          ekgNotes: p["EKG Notes"],

          // HEART SOUNDS
          heartSoundsStatus: p["Heart Sounds Status"],
          heartSoundsNotes: p["Heart Sounds Notes"],

          // FITNESS
          fitnessStatus: p["Fitness Test Status"],
          fitnessNotes: p["Fitness Test Notes"],
          sitStandCount: p["Sit-Stand Count"] || p["Sit-Stand Count  "] || "",
          vo2Max: p["Estimated VO2 Max"] || p["VO2 Max"] || "",
          functionalCategory: p["Functional Category"] || "",

          // CHOLESTEROL
          totalCholesterol: p["Total Cholesterol (mg/dL)"],
          ldlCholesterol: p["LDL Cholesterol (mg/dL)"],
          hdlCholesterol: p["HDL Cholesterol (mg/dL)"],
          triglycerides: p["Triglycerides (mg/dL)"],
          glucose: p["Glucose"] || "",
          totalCholesterolStatus: p["Total Cholesterol Status"],
          totalCholesterolNotes: p["Total Cholesterol Notes"],

          // HEART RISK
          heartRiskScore: p["Heart Risk Score"],
        }));

        setPatients(parsed);
      } catch (err) {
        alert("Failed to load patient data: " + err.message);
      }
    }

    load();
  }, []);

  const handlePatientSelect = (patientId) => {
    const patient = patients.find((p) => p.id === parseInt(patientId, 10));
    setSelectedPatient(patient);

    // Clear doctor notes/assessments when switching patient
    setDoctorNotes({
      ekg: "",
      heartSounds: "",
      fitness: "",
      vitals: "",
      cholesterol: "",
      heartRiskScore: "",
    });
    setDoctorAssessments({
      ekg: "",
      heartSounds: "",
      fitness: "",
      vitals: "",
      cholesterol: "",
      heartRiskScore: "",
    });
  };

  const handleNoteChange = (section, value) => {
    setDoctorNotes((prev) => ({ ...prev, [section]: value }));
  };

  const handleAssessmentChange = (section, value) => {
    setDoctorAssessments((prev) => ({ ...prev, [section]: value }));
  };

  // 🔹 Save Final Report → Google Sheets (final sheet)
  const handleSaveFinalReport = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }

    try {
      await saveFinalReport({
        // IDENTIFICATION
        patientName: selectedPatient.name,
        dateOfBirth: selectedPatient.dob,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        timestamp: selectedPatient.timestamp,

        // VITALS
        height: selectedPatient.height,
        weightLbs: selectedPatient.weight,
        bmi: selectedPatient.bmi,
        bloodPressure: selectedPatient.bloodPressure,
        o2Level: selectedPatient.o2,
        heartRate: selectedPatient.heartRate,

        // EKG
        ekgStatus: selectedPatient.ekgStatus,
        ekgNotes: selectedPatient.ekgNotes,
        ekgDrNotes: doctorNotes.ekg,
        ekgDrAssessment: doctorAssessments.ekg,

        // HEART SOUNDS
        heartSoundsStatus: selectedPatient.heartSoundsStatus,
        heartSoundsNotes: selectedPatient.heartSoundsNotes,
        heartSoundsDrNotes: doctorNotes.heartSounds,
        heartSoundsDrAssessment: doctorAssessments.heartSounds,

        // FITNESS TEST
        fitnessTestStatus: selectedPatient.fitnessStatus,
        fitnessTestNotes: selectedPatient.fitnessNotes,
        fitnessTestDrNotes: doctorNotes.fitness,
        fitnessTestDrAssessment: doctorAssessments.fitness,

        // NEW FITNESS FIELDS
        sitStandCount: selectedPatient.sitStandCount,
        vo2Max: selectedPatient.vo2Max,
        fitnessCategory: selectedPatient.functionalCategory,

        // CHOLESTEROL PANEL
        totalCholesterol: selectedPatient.totalCholesterol,
        ldlCholesterol: selectedPatient.ldlCholesterol,
        hdlCholesterol: selectedPatient.hdlCholesterol,
        triglycerides: selectedPatient.triglycerides,
        glucose: selectedPatient.glucose,
        totalCholesterolStatus: selectedPatient.totalCholesterolStatus,
        totalCholesterolNotes: selectedPatient.totalCholesterolNotes,
        cholesterolDrNotes: doctorNotes.cholesterol,
        cholesterolDrAssessment: doctorAssessments.cholesterol,

        // HEART RISK SCORE
        heartRiskScore: selectedPatient.heartRiskScore,
        heartRiskScoreDrNotes: doctorNotes.heartRiskScore,
        heartRiskScoreDrAssessment: doctorAssessments.heartRiskScore,

        // GENERAL DOCTOR NOTES
        drNotes: `
        EKG: ${doctorNotes.ekg}
        Heart Sounds: ${doctorNotes.heartSounds}
        Fitness: ${doctorNotes.fitness}
        Cholesterol: ${doctorNotes.cholesterol}
        Heart Risk Score: ${doctorNotes.heartRiskScore}
        `,
      });

      alert("Final report saved to Google Sheets!");
    } catch (err) {
      console.error(err);
      alert("Failed to save final report: " + err.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Heart className="header-icon" />
        <h1>Patient Medical Examination</h1>
      </header>

      <div className="content-wrapper">
        <PatientSelector patients={patients} onSelect={handlePatientSelect} />

        {selectedPatient && (
          <>
            <PatientDemographics patient={selectedPatient} />

            <TestVitals
              patient={selectedPatient}
              notes={doctorNotes.vitals}
              onNotesChange={(value) => handleNoteChange("vitals", value)}
              assessment={doctorAssessments.vitals}
              onAssessmentChange={(value) => handleAssessmentChange("vitals", value)}
            />

            <EKGSection
              result={selectedPatient.ekgStatus}
              csvNotes={selectedPatient.ekgNotes}
              notes={doctorNotes.ekg}
              onNotesChange={(value) => handleNoteChange("ekg", value)}
              assessment={doctorAssessments.ekg}
              onAssessmentChange={(value) => handleAssessmentChange("ekg", value)}
            />

            <HeartSoundsSection
              result={selectedPatient.heartSoundsStatus}
              csvNotes={selectedPatient.heartSoundsNotes}
              notes={doctorNotes.heartSounds}
              onNotesChange={(value) => handleNoteChange("heartSounds", value)}
              assessment={doctorAssessments.heartSounds}
              onAssessmentChange={(value) =>
                handleAssessmentChange("heartSounds", value)
              }
            />

            <FitnessTestSection
              result={selectedPatient.fitnessStatus}
              fitnessNotes={selectedPatient.fitnessNotes}
              sitStandCount={selectedPatient.sitStandCount}
              vo2Max={selectedPatient.vo2Max}
              functionalCategory={selectedPatient.functionalCategory}
              notes={doctorNotes.fitness}
              onNotesChange={(value) => handleNoteChange("fitness", value)}
              assessment={doctorAssessments.fitness}
              onAssessmentChange={(value) =>
                handleAssessmentChange("fitness", value)
              }
            />

            <CholesterolSection
              patient={selectedPatient}
              notes={doctorNotes.cholesterol}
              onNotesChange={(value) => handleNoteChange("cholesterol", value)}
              assessment={doctorAssessments.cholesterol}
              onAssessmentChange={(value) =>
                handleAssessmentChange("cholesterol", value)
              }
            />

            <HeartRiskScore
              score={selectedPatient.heartRiskScore}
              notes={doctorNotes.heartRiskScore}
              onNotesChange={(value) =>
                handleNoteChange("heartRiskScore", value)
              }
              assessment={doctorAssessments.heartRiskScore}
              onAssessmentChange={(value) =>
                handleAssessmentChange("heartRiskScore", value)
              }
            />

            <EmailReport
              patient={selectedPatient}
              doctorNotes={doctorNotes}
              doctorAssessments={doctorAssessments}
            />

            {/* Save Final Report Button */}
            <button
              className="save-final-btn"
              onClick={handleSaveFinalReport}
              style={{ marginTop: "1.5rem" }}
            >
              Save Final Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
