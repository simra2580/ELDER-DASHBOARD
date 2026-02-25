import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import TopStats from "../components/TopStats";
import HealthMonitor from "../components/HealthMonitor";
import EmotionChart from "../components/EmotionChart";
import PatientProfile from "../components/PatientProfile";
import type { Alert } from "../data/mockEngine";
import { LinearProgress } from "@mui/material";

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
    
  <Box sx={{ p: 2, width: "100%", overflowX: "hidden" }}>

  {/* HEADER */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={2}
  >
    <Typography
      variant="h4"
      fontWeight={700}
      sx={{
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Elder Voice Guardian
    </Typography>

    <Button variant="contained" onClick={exportReport}>
      Download Report
    </Button>
  </Box>

  {/* ACTION BUTTONS */}
  <Box
  sx={{
    display: "flex",
    gap: 1,
    flexDirection: { xs: "column", sm: "row" },
    mb: 2,
  }}
>
  <Button
    variant="outlined"
    size="medium"
    onClick={toggleTheme}
    sx={{ borderRadius: 2 }}
  >
    Toggle Theme
  </Button>

   <Button
    fullWidth
    variant="contained"
    color="error"
    size="medium"
    sx={{
      borderRadius: 3,
      fontSize: "0.85rem",
      py: 1,
    }}
    onClick={generateAlert}
  >
    GENERATE ALERT
  </Button>

  <Button
    variant="outlined"
    color="error"
    /*size="large"*/
    onClick={clearPatient}
    sx={{ borderRadius: 2 }}
  >
    Reset Patient
  </Button>
 </Box>

  {/* RISK SECTION */}
  <Box mb={2}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Patient Risk Assessment
      </Typography>

      <LinearProgress
        variant="determinate"
        value={riskScore}
        sx={{
          height: 12,
          borderRadius: 5,
          mb: 2,
          backgroundColor: "#eee",
          "& .MuiLinearProgress-bar": {
            backgroundColor:
              riskScore > 70
                ? "#d32f2f"
                : riskScore > 40
                ? "#ed6c02"
                : "#2e7d32",
          },
        }}
      />

      <Typography
        variant="h6"
        fontWeight={700}
        color={
          riskScore > 70
            ? "error.main"
            : riskScore > 40
            ? "warning.main"
            : "success.main"
        }
      >
        {riskScore}% Risk Level
      </Typography>
    </Paper>
  </Box>


      {/* 🔹 Top Stats */}
      <TopStats alerts={alerts} riskScore={riskScore} />

      <Grid container spacing={3} mt={1}>

  {/* LEFT SIDE */}
  <Grid size={{ xs: 12, md: 7 }}>
    <HealthMonitor vitals={vitals} />
  </Grid>

  {/* RIGHT SIDE */}
  <Grid size={{ xs: 12, md: 5 }}>
    <EmotionChart riskScore={riskScore} />
  </Grid>

</Grid>

      {/* Alerts Section */}
<Box mt={2}>
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" mb={2}>
      Live Alerts
    </Typography>

    <Box
  sx={{
    display: "flex",
    gap: 1,
    flexDirection: { xs: "column", sm: "row" },
    mb: 2,
  }}
>
      <Button
    fullWidth
    variant="contained"
    color="warning"
    size="medium"
    sx={{
      borderRadius: 3,
      fontSize: "0.85rem",
      py: 1,
    }}
    onClick={simulateEmergency}
  >
    SIMULATE EMERGENCY
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


        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PatientProfile
            name={patient.name}
            age={patient.age}
            condition={patient.condition}
            caregiver={patient.caregiver}
          />
        </Grid>
      </Box>
  );
}
