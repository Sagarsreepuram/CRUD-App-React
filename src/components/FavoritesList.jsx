export default function FavoritesList({ favorites }) {
  return (
    <div className="actors-container">
      {favorites.length === 0 && <p>No favorites yet</p>}
      {favorites.map((actor) => (
        <div key={actor.emsId} className="actor-card">
          <h3>{actor.name}</h3>
        </div>
      ))}
    </div>
  );
}

