const express = require('express');

const projectDb = require('./data/helpers/projectModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await projectDb.get();
    res.status(200).json(projects);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectDb.get(id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'no such project exists' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.body.name && req.body.description) {
      const newProject = await projectDb.insert(req.body);
      res.status(201).json(newProject);
    } else {
      res.status(400).json({ message: 'bad request, missing parameters' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await projectDb.update(id, req.body); //Fails if given any extra properties. How best to gracefully handle this?
    res.status(200).json(updatedProject);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await projectDb.remove(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'no such project exists' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const { id } = req.params;
    const actions = await projectDb.getProjectActions(id);
    res.status(200).json(actions);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;