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
        headers: { Authorization: user.token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await API.get("/admin/owners", {
        headers: { Authorization: user.token },
      });
      setOwners(res.data);
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
    <div className="container">
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id}>
              {u.name || "No Name"} - {u.phone}
            </li>
          ))}
        </ul>
      )}

      <h2>Owners</h2>
      {owners.length === 0 ? (
        <p>No owners found.</p>
      ) : (
        <ul>
          {owners.map((o) => (
            <li key={o._id}>
              {o.name || "No Name"} - {o.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
