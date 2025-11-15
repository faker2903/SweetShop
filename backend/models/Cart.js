const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  sweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Calculate total price before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
