require("dotenv").config();
const express = require("express");
require("./utils/passportAuth");
const passport = require("passport");
const session = require("express-session");
const dbConnect = require("./db/dbConnect");
const auth = require("./utils/auth");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoutes");
const cors = require("cors");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: [
    "https://expense-tracker-i1on.onrender.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/auth", userRouter);
app.use("/data", expenseRouter);

app.get("/data", auth, (req, res) => {
  res.json({ message: "This is the data you needed" });
  console.log(req.user);
});

app.listen(8000, () => {
  dbConnect();
  console.log("Server running on port 8000");
});
