
import { useState, useContext } from "react";
import { StayContext } from "../../context/StayContext";

export default function AddStay() {
  const { addStayToState } = useContext(StayContext);

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("rent", rent);
    formData.append("type", type);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("http://localhost:5000/api/stay/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert("Stay added successfully!");
        addStayToState(data.stay);
        // Clear form
        setTitle(""); setRent(""); setType(""); setAddress("");
        setLat(""); setLng(""); setImages([]);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Add stay error:", err);
      alert("Failed to add stay");
    }
  };

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f9f9f9;
        }
        .add-stay-container {
          max-width: 500px;
          margin: 50px auto;
          padding: 30px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          text-align: center;
          transform: translateY(-30px);
          opacity: 0;
          animation: fadeSlideIn 0.6s forwards;
        }
        @keyframes fadeSlideIn {
          to { transform: translateY(0); opacity: 1; }
        }
        .add-stay-container h1 {
          margin-bottom: 25px;
          color: #333;
          font-size: 28px;
          animation: fadeIn 0.8s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .add-stay-container input,
        .add-stay-container select,
        .add-stay-container input[type="file"] {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: 0.3s all;
        }
        .add-stay-container input:focus,
        .add-stay-container select:focus {
          border-color: #6B73FF;
          outline: none;
          box-shadow: 0 0 8px rgba(107, 115, 255, 0.3);
          transform: scale(1.02);
        }
        .add-stay-container button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #6B73FF;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s all;
        }
        .add-stay-container button:hover {
          background: #000DFF;
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      `}</style>

      <div className="add-stay-container">
        <h1>Add Stay</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rent"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Gents">Gents</option>
            <option value="Hostel">Hostel</option>
            <option value="Sharing">Sharing</option>
            <option value="Single">Single</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
          />
          <button type="submit">Add Stay</button>
        </form>
      </div>
    </>
  );
}
