require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const tasksRouter = require("./routes/tasks");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/users", tasksRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
