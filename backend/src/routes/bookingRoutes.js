import express from 'express';
const router = express.Router();

// Get all bookings
router.get('/', (req, res) => {
  res.json({ message: 'Get all bookings' });
});

// Get booking by id
router.get('/:id', (req, res) => {
  res.json({ message: `Get booking ${req.params.id}` });
});

// Create new booking
router.post('/', (req, res) => {
  res.json({ message: 'Create new booking' });
});

// Update booking
router.put('/:id', (req, res) => {
  res.json({ message: `Update booking ${req.params.id}` });
});

// Delete booking
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete booking ${req.params.id}` });
});

export default router; 