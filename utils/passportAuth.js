const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../db/userModel");
const jwt = require("jsonwebtoken");

const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://expense-tracker-backend-0ijd.onrender.com/auth/google/callback"
    : "http://localhost:8000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          await newUser.save();
          user = await User.findOne({ googleId: profile.id });
        }
        const token = jwt.sign(
          { userId: user._id, userEmail: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "3d" }
        );
        return done(null, { user, token });
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
