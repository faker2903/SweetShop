const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all users with username 'admin'
    await User.deleteMany({ username: 'admin' });
    console.log('Deleted existing admin users');

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      email: 'admin@sweetshop.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@sweetshop.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAdmin();
