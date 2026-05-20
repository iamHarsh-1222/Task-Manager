const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// CREATE TASK
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, project, assignedTo, priority, dueDate, createdBy: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET TASKS BY PROJECT
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET MY TASKS (assigned to me)
router.get('/my', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('project', 'name')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE TASK
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;