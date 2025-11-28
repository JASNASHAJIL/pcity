import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StayContext } from "../../context/StayContext.jsx";

export default function UserMap() {
  const { stays } = useContext(StayContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Rooms</h1>
      <div style={styles.cardsContainer}>
        {stays.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          stays.map((stay) => (
            <div key={stay._id} style={styles.card}>
              <h3>{stay.title}</h3>
              <p>{stay.address}</p>
              <p>Rent: {stay.rent}</p>
              <p>Type: {stay.type}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ height: "400px", marginTop: "20px" }}>
        <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {stays.map((stay) => (
            <Marker key={stay._id} position={[stay.lat || 20, stay.lng || 78]}>
              <Popup>
                <strong>{stay.title}</strong>
                <p>{stay.address}</p>
                <p>Rent: {stay.rent}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  cardsContainer: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" },
  card: {
    border: "1px solid #ccc", borderRadius: "6px", padding: "10px", width: "200px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
};
