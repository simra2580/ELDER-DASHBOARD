import { useState, useEffect, useRef } from "react";
import "./App.css";
import AlertCard from "./components/AlertCard";
import EmergencyModal from "./components/EmergencyModal";
import Toast from "./components/Toast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type Alert = {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "Escalated" | "Dismissed";
  priority: "High" | "Medium" | "Low";
  timestamp: string;
  location: string;
};

type Patient = {
  id: number;
  name: string;
  age: string;
  condition: string;
  caregiver: string;
  alerts: Alert[];
};

function App() {
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmRef.current = new Audio("/alarm.wav");
    alarmRef.current.preload = "auto";
  }, []);

  const playSound = () => {
    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(() => {});
    }
  };

  const generateId = () => Date.now() + Math.random();

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem("patients");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPatientId] = useState<number | null>(
    patients.length > 0 ? patients[0].id : null
  );

  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const [emergency, setEmergency] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const alerts = selectedPatient?.alerts || [];

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || alert.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const calculateRiskScore = (alerts: Alert[]) => {
    let score = 0;
    alerts.forEach((alert) => {
      if (alert.status === "Escalated") score += 30;
      if (alert.status === "Pending") score += 15;
      if (alert.priority === "High") score += 20;
      if (alert.priority === "Medium") score += 10;
    });
    return Math.min(100, score);
  };

  const riskScore = calculateRiskScore(alerts);

  const updateAlertStatus = (
    id: number,
    status: "Escalated" | "Dismissed"
  ) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatientId
          ? {
              ...patient,
              alerts: patient.alerts.map((alert) =>
                alert.id === id ? { ...alert, status } : alert
              ),
            }
          : patient
      )
    );

    const alert = alerts.find((a) => a.id === id);

    if (status === "Escalated") {
      playSound();
      if (alert?.priority === "High") setEmergency(alert);
      setToast("Alert Escalated");
    } else {
      setToast("Alert Dismissed");
    }

    setTimeout(() => setToast(""), 3000);
  };

  const addMoodAlert = () => {
    const newAlert: Alert = {
      id: generateId(),
      title: "Mood Drop",
      description: "Low mood detected from voice pattern analysis",
      status: "Pending",
      priority: "Low",
      timestamp: new Date().toLocaleString(),
      location: "Living Room",
    };

    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatientId
          ? { ...patient, alerts: [...patient.alerts, newAlert] }
          : patient
      )
    );

    playSound();
    setToast("New Mood Alert Added");
    setTimeout(() => setToast(""), 3000);
  };

  const exportPDF = async () => {
    const element = document.getElementById("dashboard-content");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(16);
    pdf.text("ElderVoice Guardian - Caregiver Monitoring Report", 10, 10);

    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);

    pdf.addImage(imgData, "PNG", 0, 25, 210, 260);
    pdf.save("caregiver-dashboard-report.pdf");
  };

  if (loading) {
    return (
      <div className="app">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  const pending = alerts.filter((a) => a.status === "Pending").length;
  const escalated = alerts.filter((a) => a.status === "Escalated").length;
  const dismissed = alerts.filter((a) => a.status === "Dismissed").length;

  const overviewData = {
    labels: ["Pending", "Escalated", "Dismissed"],
    datasets: [
      {
        label: "Alert Overview",
        data: [pending, escalated, dismissed],
        backgroundColor: ["#f39c12", "#e74c3c", "#27ae60"],
      },
    ],
  };

  const weeklyTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Alerts",
        data: [2, 3, 1, 4, 2, 5, 3],
        borderColor: "#3498db",
      },
    ],
  };

  return (
  <div className={darkMode ? "dark app" : "app"}>
    <div className="dashboard-wrapper">
      <div id="dashboard-content"></div>
        <div className="dashboard-header">
          <div>
            <h1>ElderVoice Guardian</h1>
            <p>AI-Powered Patient Monitoring Dashboard</p>
          </div>
          <div>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button onClick={exportPDF}>Export Report</button>
          </div>
        </div>

        <div className="patient-card">
          <h2>{selectedPatient?.name}</h2>
          <p>Age: {selectedPatient?.age}</p>
          <p>Condition: {selectedPatient?.condition}</p>
          <p>Caregiver: {selectedPatient?.caregiver}</p>

          <h3>AI Risk Score: {riskScore}%</h3>
          <p className="risk-note">
            Based on On-Device AI Voice Analysis
          </p>

          <div className="risk-bar">
            <div
              className="risk-fill"
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
        </div>

        <div className="charts-container">
          <Bar data={overviewData} />
          <Line data={weeklyTrend} />
        </div>

        <h2>Alerts</h2>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Escalated">Escalated</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        <div className="alerts-grid">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onEscalate={(id) => updateAlertStatus(id, "Escalated")}
              onDismiss={(id) => updateAlertStatus(id, "Dismissed")}
            />
          ))}
        </div>

        <button onClick={addMoodAlert}>Simulate Mood Drop</button>

        <h2 style={{ marginTop: "40px" }}>
          Caregiver Intervention Log
        </h2>

        <div className="timeline">
          {alerts
            .slice()
            .reverse()
            .map((alert) => (
              <div key={alert.id} className="timeline-item">
                <strong>{alert.title}</strong>
                <p>{alert.status} • {alert.timestamp}</p>
              </div>
            ))}
        </div>
      </div>

      {emergency && (
        <EmergencyModal
          title={emergency.title}
          description={emergency.description}
          onClose={() => setEmergency(null)}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}

export default App;