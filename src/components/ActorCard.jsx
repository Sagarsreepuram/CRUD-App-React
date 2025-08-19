import { useState } from "react";
import { Button, Modal, Box, TextField } from "@mui/material";

export default function ActorCard({
  actor,
  isFavorite,
  toggleFavorite,
  onDelete,
  onUpdate,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: actor.name,
    recentTitleYear: actor.recentTitleYear,   // ✅ fixed field name
    filmographyCount: actor.filmographyCount,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // await fetch(`http://localhost:3001/actors/${actor.emsId}`, {
    await fetch(`https://crud-app-react-6v09.onrender.com/actors/${actor.emsId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...actor, ...formData }), // ✅ keep emsId, imageUrl, etc
    });
    setOpen(false);
    onUpdate(); // refresh list in parent
  };

  return (
    <div className="actor-card">
      <img
        src={actor.profileImageUrl || "default.jpg"}   // ✅ use correct field name
        alt={actor.name}
        className="actor-poster"
      />
      <h2 className="actor-name">{actor.name}</h2>
      <p>
        <strong>EMS ID:</strong> {actor.emsId || "NA"}
      </p>
      <p>
        <strong>Recent Year:</strong> {actor.recentTitleYear || "NA"}
      </p>
      <p>
        <strong>Filmography Count:</strong> {actor.filmographyCount || 0}
      </p>

      {/* Favorite Button */}
      <button onClick={() => toggleFavorite(actor)} className="favorite-btn">
        {isFavorite ? "💔 Remove" : "❤️ Add"}
      </button>

      {/* Delete Button */}
      <Button
        variant="outlined"
        color="error"
        onClick={async () => {
        //  await fetch(`http://localhost:3001/actors/${actor.emsId}`, {
        await fetch(`https://crud-app-react-6v09.onrender.com/actors/${actor.emsId}`, {
            method: "DELETE",
          });
          onDelete();
        }}
        sx={{ mt: 1 }}
      >
        Delete
      </Button>

      {/* Edit Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mt: 1, ml: 1 }}
      >
        Edit
      </Button>

      {/* Modal for Editing */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Edit Actor</h2>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Recent Year"
            name="recentTitleYear"   // ✅ corrected
            type="number"
            fullWidth
            margin="normal"
            value={formData.recentTitleYear}
            onChange={handleChange}
          />
          <TextField
            label="Filmography Count"
            name="filmographyCount"
            type="number"
            fullWidth
            margin="normal"
            value={formData.filmographyCount}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ mt: 2, mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
