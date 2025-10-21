// server/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET /api/events  -> events for logged-in admin
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const events = await Event.getByAdminId(req.admin.id);
    res.json(events);
  } catch (err) {
    console.error('GET /api/events error:', err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// PUT /api/events/:id -> update event
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    // optional: verify ownership (ensure adminId matches)
    const existing = await Event.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Event not found' });
    if (existing.adminId !== req.admin.id) return res.status(403).json({ message: 'Forbidden' });

    const updatedEvent = await Event.update(req.params.id, req.body);
    res.json(updatedEvent);
  } catch (err) {
    console.error('PUT /api/events/:id error:', err);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// DELETE /api/events/:id -> delete event
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const existing = await Event.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Event not found' });
    if (existing.adminId !== req.admin.id) return res.status(403).json({ message: 'Forbidden' });

    await Event.delete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/events/:id error:', err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router;
