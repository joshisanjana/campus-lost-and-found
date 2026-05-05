const User = require('../models/User');
const Item = require('../models/Item');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Verify user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.isVerified = req.body.isVerified;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all items
// @route   GET /api/admin/items
// @access  Private/Admin
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({})
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Delete item
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  
  if (item) {
    await item.remove();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

module.exports = {
  getUsers,
  verifyUser,
  getItems: getItems,
  deleteItem: deleteItem
};
