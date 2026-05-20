const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

// CREATE PROJECT (Admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  try {
    const { name, description, members } = req.body;
    const project = await Project.create({ name, description, owner: req.user.id, members: members || [] });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PROJECTS FOR USER
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'Admin'
      ? { owner: req.user.id }
      : { members: req.user.id };
    const projects = await Project.find(query).populate('owner', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE PROJECT
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROJECT (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE PROJECT (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admins only' });
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;