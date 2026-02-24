import {
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";

type Vitals = {
  heartRate: number;
  systolic: number;
  oxygen: number;
};

type Props = {
  vitals: Vitals;
};

export default function HealthMonitor({ vitals }: Props) {
  const [history, setHistory] = useState<any[]>([]);

  // Add new vitals to history whenever vitals change
  useEffect(() => {
    setHistory((prev) => {
      const updated = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          heartRate: vitals.heartRate,
          bloodPressure: vitals.systolic,
          oxygen: vitals.oxygen,
        },
      ];

      // Keep only last 10 readings
      return updated.slice(-10);
    });
  }, [vitals]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Health Monitoring
      </Typography>

      <Box sx={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="oxygen" />
            <Line type="monotone" dataKey="heartRate" />
            <Line type="monotone" dataKey="bloodPressure" />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}