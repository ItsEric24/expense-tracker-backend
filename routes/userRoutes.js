const express = require("express");
const { registerUser, loginUser } = require("./../controllers/userController");
const router = express.Router();
const passport = require("passport");

const clientUrl =
  process.env.NODE_ENV === "production"
    ? "https://expense-tracker-i1on.onrender.com"
    : "http://localhost:3000";

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${clientUrl}/login`,
  }),
  (req, res) => {
    const token = req.user.token;
    const username = req.user.user.username;
    const userId = req.user.user._id;
    res.redirect(
      `${clientUrl}/login?token=${token}&username=${encodeURIComponent(
        username
      )}&userId=${userId}`
    );
  }
);

module.exports = router;
