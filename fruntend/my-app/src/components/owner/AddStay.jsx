import { useState } from "react";
import API from "../../api";

export default function AddStay() {
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(Boolean);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!images.length) return alert("Upload at least one image");
    if (isNaN(lat) || isNaN(lng)) return alert("Latitude and Longitude must be numbers");

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("rent", rent);
    formData.append("type", type);
    formData.append("address", address);
    formData.append("lat", lat);
    formData.append("lng", lng);
    images.forEach((img) => formData.append("images", img));

    try {
      const token = localStorage.getItem("token"); // Make sure token exists
      const res = await API.post("/stay/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Let Axios set Content-Type automatically
        },
      });

      alert(res.data.message);

      // Reset form
      setTitle("");
      setRent("");
      setType("");
      setAddress("");
      setLat("");
      setLng("");
      setImages([]);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error uploading stay");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
      }}
    >
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="number" placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} required />
      <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} required />
      <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input type="text" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} required />
      <input type="text" placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} required />
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />

      {/* Preview selected images */}
      {images.length > 0 && (
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
            />
          ))}
        </div>
      )}

      <button type="submit">Add Stay</button>
    </form>
  );
}
