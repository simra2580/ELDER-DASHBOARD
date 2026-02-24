import { Paper, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

export default function EmotionChart() {
  const data = [
    { name: "Happy", value: 40 },
    { name: "Neutral", value: 30 },
    { name: "Sad", value: 20 },
    { name: "Stress", value: 10 },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Voice Emotion Analysis
      </Typography>

       <Box sx={{ width: "100%" }}>
  <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Typography textAlign="center" variant="h6" mt={2}>
        Mood Status: Stable
      </Typography>
    </Paper>
  );
}