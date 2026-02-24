import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

type Props = {
  onSave: (patient: {
    name: string;
    age: number;
    condition: string;
    caregiver: string;
  }) => void;
};

export default function PatientForm({ onSave }: Props) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    condition: "",
    caregiver: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.age) return;

    onSave({
      name: form.name,
      age: Number(form.age),
      condition: form.condition,
      caregiver: form.caregiver,
    });
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" mb={2}>
          Enter Patient Details
        </Typography>

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="number"
          label="Age"
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Condition"
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, condition: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Caregiver"
          margin="normal"
          onChange={(e) =>
            setForm({ ...form, caregiver: e.target.value })
          }
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Save & Continue
        </Button>
      </Paper>
    </Box>
  );
}