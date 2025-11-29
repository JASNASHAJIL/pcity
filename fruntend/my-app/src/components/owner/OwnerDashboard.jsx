import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { StayContext } from "../../context/StayContext.jsx";

export default function OwnerDashboard() {
  const { stays } = useContext(StayContext);

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f4f8;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
          animation: fadeIn 1s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }
        .card {
          background: linear-gradient(135deg, #6b73ff, #000dff);
          color: #fff;
          border-radius: 12px;
          padding: 15px;
          width: 220px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
          animation: cardFade 0.5s ease forwards;
        }
        .card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 12px 25px rgba(0,0,0,0.3);
        }
        @keyframes cardFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card h3 {
          margin-top: 0;
          font-size: 20px;
        }
        .card p {
          margin: 5px 0;
        }
        .map-container {
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          animation: fadeInMap 0.8s ease forwards;
        }
        @keyframes fadeInMap {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ padding: "20px" }}>
        <h1>Available Rooms</h1>
        <div className="cards-container">
          {stays.length === 0 ? (
            <p>No rooms available.</p>
          ) : (
            stays.map((stay) => (
              <div key={stay._id} className="card">
                <h3>{stay.title}</h3>
                <p>{stay.address}</p>
                <p>Rent: {stay.rent}</p>
                <p>Type: {stay.type}</p>
              </div>
            ))
          )}
        </div>

        <div className="map-container">
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
    </>
  );
}
