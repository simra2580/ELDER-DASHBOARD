import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import TopStats from "../components/TopStats";
import HealthMonitor from "../components/HealthMonitor";
import EmotionChart from "../components/EmotionChart";
import PatientProfile from "../components/PatientProfile";
import type { Alert } from "../data/mockEngine";

type Props = {
  alerts: Alert[];
  riskScore: number;

  vitals: {
    heartRate: number;
    systolic: number;
    oxygen: number;
  };

  patient: {
    name: string;
    age: number;
    condition: string;
    caregiver: string;
  };

  generateAlert: () => void;
  simulateEmergency: () => void;
  updateStatus: (
    id: number,
    status: "Pending" | "Escalated" | "Dismissed"
  ) => void;

  exportReport: () => void;
  toggleTheme: () => void;
  clearPatient: () => void;
};
 

export default function DashboardPage({
  alerts,
  riskScore,
  patient,
  generateAlert,
  simulateEmergency,
  updateStatus,
  exportReport,
  toggleTheme,
  clearPatient,
  vitals,
}: Props) {
  return (
    <Box>
        <Box display="flex" justifyContent="space-between" mb={3}>
  <Typography variant="h5">
    Elder Voice Guardian Dashboard
  </Typography>

  <Box display="flex" gap={2}>
    <Button variant="outlined" onClick={toggleTheme}>
      Toggle Theme
    </Button>

    <Button variant="contained" color="error" onClick={generateAlert}>
      Generate Alert
    </Button>

    <Button color="error" onClick={clearPatient}>
      Reset Patient
    </Button>
  </Box>
</Box>
<Box mb={3}>
<Paper sx={{ p: 3, mb: 3}}>
<Typography
  variant="h4"
  color={
    riskScore > 70
      ? "error.main"
      : riskScore > 40
      ? "warning.main"
      : "success.main"
  }
>
  Risk Level: {riskScore}%
</Typography>
</Paper>
</Box>

      {/* 🔹 Top Stats */}
      <TopStats alerts={alerts} riskScore={riskScore} />

      {/* 🔹 Main Grid */}
      <Grid container spacing={3} mt={1}>

        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>

          {/* Health Monitor */}
          <Paper sx={{ p: 3, mb: 3 }}>
  <Typography variant="h6">Current Vitals</Typography>
  <Typography>Heart Rate: {vitals.heartRate} bpm</Typography>
  <Typography>Blood Pressure: {vitals.systolic} mmHg</Typography>
  <Typography>Oxygen: {vitals.oxygen}%</Typography>
</Paper>
          <HealthMonitor vitals={vitals} />

          <Box mt={3}>
            <EmotionChart />
          </Box>

          {/* Alerts Section */}
      {/* Alerts Section */}
<Box mt={3}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" mb={2}>
      Live Alerts
    </Typography>

    <Box mb={2}>
      <Button
        variant="contained"
        color="warning"
        onClick={simulateEmergency}
        sx={{ mr: 2 }}
      >
        Simulate Emergency
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={generateAlert}
      >
        Generate Alert
      </Button>
    </Box>

    {alerts.length === 0 ? (
      <Typography color="text.secondary">
        No alerts generated
      </Typography>
    ) : (
      alerts.map(alert => (
        <Paper
          key={alert.id}
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderLeft: "5px solid",
            borderColor:
              alert.status === "Escalated"
                ? "error.main"
                : alert.status === "Pending"
                ? "warning.main"
                : "success.main",
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              {alert.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {alert.location} • {alert.timestamp}
            </Typography>
          </Box>

          <Box>
            {alert.status === "Pending" && (
              <>
                <Button
                  size="small"
                  color="error"
                  sx={{ mr: 1 }}
                  onClick={() =>
                    updateStatus(alert.id, "Escalated")
                  }
                >
                  Escalate
                </Button>

                <Button
                  size="small"
                  color="success"
                  onClick={() =>
                    updateStatus(alert.id, "Dismissed")
                  }
                >
                  Dismiss
                </Button>
              </>
            )}

            {alert.status !== "Pending" && (
              <Typography
                fontWeight={600}
                color={
                  alert.status === "Escalated"
                    ? "error"
                    : "success"
                }
              >
                {alert.status}
              </Typography>
            )}
          </Box>
        </Paper>
      ))
    )}
  </Paper>
</Box>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PatientProfile
            name={patient.name}
            age={patient.age}
            condition={patient.condition}
            caregiver={patient.caregiver}
          />
        </Grid>

      </Grid>
    </Box>
  );
}
