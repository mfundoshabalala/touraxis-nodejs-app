const express = require("express");
const Task = require("../models/task");
const User = require("../models/user");
const router = express.Router();

// Create a new task for a user
router.post("/:userId/tasks", async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.params.userId,
    });
    await task.save();

    const user = await User.findById(req.params.userId);
    user.tasks.push(task._id);
    await user.save();

    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tasks for a user
router.get("/:userId/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId });
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a task by ID for a user
router.get("/:userId/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.params.userId,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a task
router.put("/:userId/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, user: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a task
router.delete("/:userId/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      user: req.params.userId,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
