const Admin = require("./models/Admin");

async function createDefaultAdmin() {
  const exists = await Admin.findOne({ phone: "9999999999" }); // your admin login number
  if (exists) return;

  await Admin.create({
    name: "Super Admin",
    phone: "9999999999",
    role: "admin",
  });

  console.log("Default Admin Created");
}

module.exports = createDefaultAdmin;
