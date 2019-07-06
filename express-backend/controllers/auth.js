const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtSecret");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  //can input SQL funtion in parameters if wanted.
  const user = await User.findOne({ email });
  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign(user.email, "youknow");
      return res.json({ token: token });
    }
    return res.send(`Password does not match email ${email}`);
  }
  return res.send(`This email ${email} does not exist`);
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res
        .status(409)
        .send(`An account with the email ${email} already exist.`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    const result = await user.save();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};
