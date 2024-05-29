const bcrypt = require("bcrypt");
const User = require("./../db/userModel");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email or password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email or password" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ message: "Wrong credentials, check email or password" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res
        .status(400)
        .json({ message: "Wrong credentials, check password or email" });
    }

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      message: "Login Successfull",
      user: user.username,
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Login unsuccessfull", error });
  }
}

module.exports = {
  registerUser,
  loginUser,
};
