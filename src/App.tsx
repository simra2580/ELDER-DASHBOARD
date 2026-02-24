import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import getTheme from "./theme";
import DashboardPage from "./pages/DashboardPage";
import PatientForm from "./pages/PatientForm";
import {
  generateVitals,
  calculateRisk,
} from "./data/mockEngine";
import type { Vitals, Alert } from "./data/mockEngine";

type Patient = {
  name: string;
  age: number;
  condition: string;
  caregiver: string;
};

export default function App() {

  /* ===============================
     THEME
  =============================== */

  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("mode") as "light" | "dark") || "light"
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);


  /* ===============================
     PATIENT (Persistent + Onboarding)
  =============================== */

  const [patient, setPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem("patient");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (patient) {
      localStorage.setItem("patient", JSON.stringify(patient));
    }
  }, [patient]);

  const clearPatient = () => {
    localStorage.removeItem("patient");
    setPatient(null);
  };


  /* ===============================
     VITALS (Dynamic Engine)
  =============================== */

  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 78,
    systolic: 120,
    oxygen: 98,
  });


  /* =====================================================
   ALERT SYSTEM (FINAL CLEAN STABLE VERSION)
===================================================== */

/* Core States */
const [alerts, setAlerts] = useState<Alert[]>([]);
const [wasAbnormal, setWasAbnormal] = useState(false);
const [isEmergency, setIsEmergency] = useState(false);

/* =====================================================
   VITAL ENGINE CONTROL
   - Stops auto-random updates during emergency
===================================================== */

useEffect(() => {
  if (isEmergency) return;

  const interval = setInterval(() => {
    setVitals(prev => generateVitals(prev));
  }, 4000);

  return () => clearInterval(interval);
}, [isEmergency]);

/* =====================================================
   ABNORMAL DETECTION (Triggers ONCE)
===================================================== */

useEffect(() => {
  const abnormal =
    vitals.heartRate > 120 ||
    vitals.systolic > 160 ||
    vitals.oxygen < 90;

  if (abnormal && !wasAbnormal) {
    setAlerts(prev => [
      {
        id: Date.now(),
        title: "Abnormal Vital Detected",
        location: "Monitoring Engine",
        timestamp: new Date().toLocaleTimeString(),
        status: "Pending",
      },
      ...prev,
    ]);
  }

  setWasAbnormal(abnormal);
}, [vitals, wasAbnormal]);

/* =====================================================
   AUTO ESCALATION (15s delay)
===================================================== */

useEffect(() => {
  const timer = setInterval(() => {
    setAlerts(prev =>
      prev.map(a =>
        a.status === "Pending"
          ? { ...a, status: "Escalated" }
          : a
      )
    );
  }, 15000);

  return () => clearInterval(timer);
}, []);

/* =====================================================
   MANUAL ALERT
===================================================== */

const generateAlert = () => {
  setAlerts(prev => [
    {
      id: Date.now(),
      title: "Manual Alert Triggered",
      location: "Caregiver Panel",
      timestamp: new Date().toLocaleTimeString(),
      status: "Pending",
    },
    ...prev,
  ]);
};

/* =====================================================
   SIMULATE EMERGENCY
===================================================== */

const simulateEmergency = () => {
  setIsEmergency(true);

  setVitals({
    heartRate: 150,
    systolic: 180,
    oxygen: 85,
  });
};

/* =====================================================
   UPDATE ALERT STATUS
===================================================== */

const updateStatus = (
  id: number,
  status: "Pending" | "Escalated" | "Dismissed"
) => {
  setAlerts(prev =>
    prev.map(alert =>
      alert.id === id
        ? { ...alert, status }
        : alert
    )
  );

  if (status === "Dismissed") {
    setIsEmergency(false);
  }
};

  /* ===============================
     RISK
  =============================== */

  const riskScore = calculateRisk(vitals, alerts);


  /* ===============================
     EXPORT FUNCTION
  =============================== */

  const exportReport = () => {
    const data = JSON.stringify(
      { patient, vitals, alerts, riskScore },
      null,
      2
    );

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "elder-report.json";
    a.click();
  };


  /* ===============================
     ROUTING LOGIC
  =============================== */

  if (!patient) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PatientForm onSave={setPatient} />
      </ThemeProvider>
    );
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardPage
        vitals={vitals}
        alerts={alerts}
        riskScore={riskScore}
        patient={patient}
        generateAlert={generateAlert}
        exportReport={exportReport}
        simulateEmergency={simulateEmergency}
        updateStatus={updateStatus}
        toggleTheme={() =>
          setMode(mode === "light" ? "dark" : "light")
        }
        clearPatient={clearPatient}
      />
    </ThemeProvider>
  );
}