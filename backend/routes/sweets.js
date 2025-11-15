const express = require('express');
const Sweet = require('../models/Sweet');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all sweets (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search sweets (protected)
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new sweet (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
      description,
      imageUrl
    });

    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    console.error('Add sweet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update sweet (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, quantity, description, imageUrl } = req.body;

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { name, category, price, quantity, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete sweet (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase sweet (protected)
router.post('/:id/purchase', authenticateToken, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: 'Sweet out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.json({
      message: 'Purchase successful',
      sweet: {
        ...sweet.toObject(),
        quantity: sweet.quantity
      }
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Restock sweet (admin only)
router.post('/:id/restock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      message: 'Restock successful',
      sweet: {
        ...sweet.toObject(),
        quantity: sweet.quantity
      }
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
