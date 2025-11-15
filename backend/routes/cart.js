const express = require('express');
const Cart = require('../models/Cart');
const Sweet = require('../models/Sweet');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.sweet');
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { sweetId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be positive' });
    }

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item =>
      item.sweet.toString() === sweetId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        sweet: sweetId,
        quantity,
        price: sweet.price
      });
    }

    await cart.save();
    await cart.populate('items.sweet');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item quantity in cart
router.put('/update', async (req, res) => {
  try {
    const { sweetId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (quantity > 0 && sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item =>
      item.sweet.toString() === sweetId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.sweet');

    res.json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:sweetId', async (req, res) => {
  try {
    const { sweetId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item =>
      item.sweet.toString() !== sweetId
    );

    await cart.save();
    await cart.populate('items.sweet');

    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Checkout cart
router.post('/checkout', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.sweet');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (cart.totalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid cart total' });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.sweet.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.sweet.name}`
        });
      }
    }

    // Update sweet quantities
    for (const item of cart.items) {
      await Sweet.findByIdAndUpdate(item.sweet._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      message: 'Checkout successful',
      totalPaid: cart.totalPrice
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
