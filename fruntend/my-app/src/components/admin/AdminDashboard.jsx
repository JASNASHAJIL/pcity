import { useEffect, useState, useContext } from "react";
import API from "../../api";
import { StayContext } from "../../context/StayContext";

export default function AdminDashboard() {
  const { user } = useContext(StayContext); // JWT + role
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await API.get("/admin/owners", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOwners(res.data.owners || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching owners");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOwners();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Users Section */}
      <section>
        <h2 style={styles.sectionTitle}>Users</h2>
        {users.length === 0 ? (
          <p style={styles.noData}>No users found.</p>
        ) : (
          <div style={styles.cardGrid}>
            {users.map((u) => (
              <div key={u._id} style={styles.card}>
                <h3>{u.name || "No Name"}</h3>
                <p>{u.phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Owners Section */}
      <section>
        <h2 style={styles.sectionTitle}>Owners</h2>
        {owners.length === 0 ? (
          <p style={styles.noData}>No owners found.</p>
        ) : (
          <div style={styles.cardGrid}>
            {owners.map((o) => (
              <div key={o._id} style={styles.card}>
                <h3>{o.name || "No Name"}</h3>
                <p>{o.phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------- INTERNAL CSS ----------------
const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(120deg, #f0f8ff, #e6f7ff)",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#1e3a8a",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#0f172a",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "linear-gradient(145deg, #a5f3fc, #38bdf8)",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
    textAlign: "center",
    cursor: "pointer",
  },
  noData: {
    fontStyle: "italic",
    color: "#334155",
  },
};

// ---------------- CARD HOVER ANIMATION ----------------
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("div[style*='card']");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 15px 25px rgba(0,0,0,0.3)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
    });
  });
});
