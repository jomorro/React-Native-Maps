const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
  const usersFromDb = await User.find({});
  const usersWithoutPassword = usersFromDb.map(
    ({ email, firstName, lastName }) => ({
      email,
      firstName,
      lastName
    })
  );
  return res.json(usersWithoutPassword);
};
