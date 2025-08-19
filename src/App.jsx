import { useEffect, useState } from "react";
import ActorForm from "./components/ActorForm";
import SearchBar from "./components/SearchBar";
import FavoritesList from "./components/FavoritesList";
import ActorCard from "./components/ActorCard";
import "./App.css";

export default function App() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actors, setActors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  // ✅ Fetch actors from backend
  const fetchActors = () => {
    // fetch("http://localhost:3001/actors")
    fetch("https://crud-app-react-6v09.onrender.com/actors")
      .then((res) => res.json())
      .then((data) => setActors(data))
      .catch((err) => console.error("Error fetching actors:", err));
  };

  // ✅ Initial load
  useEffect(() => {
    fetchActors();
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  // ✅ Save favorites in localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Search filter
  const filteredActors = actors.filter((actor) =>
    (actor.name || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // toggleFavorite
  const toggleFavorite = (actor) => {
    if (favorites.some((fav) => fav.emsId === actor.emsId)) {
      setFavorites(favorites.filter((fav) => fav.emsId !== actor.emsId));
    } else {
      setFavorites([...favorites, actor]);
    }
  };

  // ✅ Handle edit click
  const handleEditClick = (actor) => {
    setSelectedActor(actor);
    setOpenEditModal(true);
  };

  // ✅ Update actor
  // handleUpdateActor
  const handleUpdateActor = async (updatedActor) => {
    // await fetch(`http://localhost:3001/actors/${updatedActor.emsId}`, {
    await fetch(`https://crud-app-react-6v09.onrender.com/actors/${actor.emsId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedActor),
    });

    setActors((prev) =>
      prev.map((actor) =>
        actor.emsId === updatedActor.emsId ? updatedActor : actor
      )
    );

    setOpenEditModal(false);
    setSelectedActor(null);
  };

  return (
    <div className="app-container">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <h2>Favorites ❤️</h2>
      <FavoritesList favorites={favorites} />

      <h2>Add New Actor</h2>
      <ActorForm onAdd={fetchActors} />

      <div className="actors-container">
        {filteredActors.map((actor) => (
          <ActorCard
            key={actor.emsId}
            actor={actor}
            isFavorite={favorites.some((fav) => fav.emsId === actor.emsId)}
            toggleFavorite={toggleFavorite}
            onDelete={fetchActors}
            onUpdate={fetchActors}
          />
        ))}
      </div>

      {/* ✅ Edit Modal (only shows when editing) */}
      {openEditModal && selectedActor && (
        <div className="edit-modal">
          <h2>Edit Actor</h2>
          <ActorForm
            existingActor={selectedActor}
            onSave={handleUpdateActor}
            onCancel={() => setOpenEditModal(false)}
          />
        </div>
      )}
    </div>
  );
}
