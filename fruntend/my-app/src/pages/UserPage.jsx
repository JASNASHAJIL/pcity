import { useEffect, useState } from "react";
import API from "../api";

export default function UserPage() {
  const [stays, setStays] = useState([]);

  useEffect(() => {
    API.get("/stay/all")
      .then(res => {
        console.log("API Response:", res.data);
        setStays(res.data.stays); // IMPORTANT
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Stays</h1>

      {stays.length === 0 ? (
        <p>No stays found</p>
      ) : (
        stays.map(stay => (
          <div key={stay._id} style={{border:'1px solid #ddd', margin:'10px', padding:'10px'}}>
            <h3>{stay.title}</h3>
            <p>{stay.location}</p>
          </div>
        ))
      )}
    </div>
  );
}
