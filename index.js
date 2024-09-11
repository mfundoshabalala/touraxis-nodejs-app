require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const tasksRouter = require("./routes/tasks");
const Task = require("./models/task"); // Import Task model

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

// Scheduled job to update overdue tasks
setInterval(async () => {
  const now = new Date();
  try {
    const tasks = await Task.find({
      status: "pending",
      next_execute_date_time: { $lt: now },
    });

    tasks.forEach(async (task) => {
      console.log(`Task overdue: ${task.name}`);
      task.status = "done";
      await task.save();
    });
  } catch (err) {
    console.error("Error checking overdue tasks:", err);
  }
}, 60000); // Runs every 60 seconds
