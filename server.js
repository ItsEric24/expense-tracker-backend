const express = require("express");
const dbConnect = require("./db/dbConnect");
const auth = require("./utils/auth");
const userRouter = require("./routes/userRoutes");
const expenseRouter = require("./routes/expenseRoutes");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    "https://expense-tracker-i1on.onrender.com",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/users", userRouter);
app.use("/data", expenseRouter);

app.get("/data", auth, (req, res) => {
  res.json({ message: "This is the data you needed" });
  console.log(req.user);
});

app.listen(8000, () => {
  dbConnect();
  console.log("Server running on port 8000");
});
