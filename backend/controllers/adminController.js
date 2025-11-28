const User = require("../models/User");
const Owner = require("../models/Owner");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getAllOwners = async (req, res) => {
  const owners = await Owner.find();
  res.json(owners);
};
