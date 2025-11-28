import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StayContext } from "../context/StayContext";

export default function UserPage() {
  const { stays } = useContext(StayContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Vacant Rooms</h1>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {stays.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          stays.map((stay) => (
            <div key={stay._id} style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "220px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
              <h3>{stay.title}</h3>
              <p>{stay.address}</p>
              <p>Rent: ₹{stay.rent}</p>
              <p>Type: {stay.type}</p>
              <div style={{ display: "flex", gap: "5px", overflowX: "auto" }}>
                {stay.images?.map((img, i) => (
                  <img key={i} src={img} alt="stay" width={80} style={{ borderRadius: "4px" }} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ height: "400px", marginTop: "30px" }}>
        <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {stays.map((stay) => (
            <Marker key={stay._id} position={[stay.lat, stay.lng]}>
              <Popup>
                <strong>{stay.title}</strong>
                <p>{stay.address}</p>
                <p>Rent: ₹{stay.rent}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
