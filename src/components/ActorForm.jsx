import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as Yup from "yup";

// Validation schema
const ActorSchema = Yup.object().shape({
  name: Yup.string().required("Actor name is required"),
  emsId: Yup.string().required("EMS ID is required"),
  recentYear: Yup.number()
    .typeError("Must be a number")
    .required("Recent Year is required"),
  filmographyCount: Yup.number()
    .typeError("Must be a number")
    .required("Filmography Count is required"),
  imageUrl: Yup.string().url("Must be a valid URL"),
});

export default function ActorForm({ onAdd }) {
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "warning" | "info"
  });

  return (
    <Formik
      initialValues={{
        name: "",
        emsId: "",
        recentYear: "",
        filmographyCount: "",
        imageUrl: "",
      }}
      validationSchema={ActorSchema}
      validateOnMount
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          setSubmitting(true); // 🔹 submit started
          const res = await fetch("http://localhost:3001/actors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }

          // Optionally read the created item:
          // const created = await res.json();

          setSnack({
            open: true,
            message: "Actor added successfully!",
            severity: "success",
          });

          resetForm();
          if (typeof onAdd === "function") onAdd(); // refresh list in parent
        } catch (err) {
          setSnack({
            open: true,
            message: err?.message || "Failed to add actor",
            severity: "error",
          });
        } finally {
          setSubmitting(false); // 🔹 submit finished
        }
      }}
    >
      {({ errors, touched, isValid, isSubmitting }) => (
        <Form noValidate>
          {/* Top loading bar while submitting */}
          {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}

          <Box display="grid" gap={2} maxWidth={420}>
            <Field
              name="name"
              as={TextField}
              label="Actor Name"
              fullWidth
              error={touched.name && Boolean(errors.name)}
              helperText={<ErrorMessage name="name" />}
            />

            <Field
              name="emsId"
              as={TextField}
              label="EMS ID"
              fullWidth
              error={touched.emsId && Boolean(errors.emsId)}
              helperText={<ErrorMessage name="emsId" />}
            />

            <Field
              name="recentYear"
              as={TextField}
              label="Recent Year"
              type="number"
              fullWidth
              error={touched.recentYear && Boolean(errors.recentYear)}
              helperText={<ErrorMessage name="recentYear" />}
            />

            <Field
              name="filmographyCount"
              as={TextField}
              label="Filmography Count"
              type="number"
              fullWidth
              error={
                touched.filmographyCount && Boolean(errors.filmographyCount)
              }
              helperText={<ErrorMessage name="filmographyCount" />}
            />

            <Field
              name="imageUrl"
              as={TextField}
              label="Image URL"
              fullWidth
              error={touched.imageUrl && Boolean(errors.imageUrl)}
              helperText={<ErrorMessage name="imageUrl" />}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={18} /> : null}
            >
              {isSubmitting ? "Adding..." : "Add Actor"}
            </Button>
          </Box>

          <Snackbar
            open={snack.open}
            autoHideDuration={2500}
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnack((s) => ({ ...s, open: false }))}
              severity={snack.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snack.message}
            </Alert>
          </Snackbar>
        </Form>
      )}
    </Formik>
  );
}
