const express = require('express');

const actionsDb = require('./data/helpers/actionModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const actions = await actionsDb.get();
    res.status(200).json(actions);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const action = await actionsDb.get(id);
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ message: 'no such action exists' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.body.notes && req.body.description && req.body.project_id) {
      const newAction = await actionsDb.insert(req.body);
      res.status(201).json(newAction);
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
    const updatedAction = await actionsDb.update(id, req.body); //Fails if given any extra properties. How best to gracefully handle this?
    res.status(200).json(updatedAction);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await actionsDb.remove(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'no such action exists' });
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;