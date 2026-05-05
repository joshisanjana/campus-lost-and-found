const Item = require('../models/Item');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Create a new lost/found item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, location, date, type, image } = req.body;

  const item = await Item.create({
    title,
    description,
    category,
    location,
    date,
    type,
    image,
    postedBy: req.user._id,
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
});

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  const { type, category, location, status } = req.query;
  
  let filter = {};
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (location) filter.location = new RegExp(location, 'i');
  if (status) filter.status = status;
  
  const items = await Item.find(filter)
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 });
  
  res.json(items);
});

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate('postedBy', 'name email');
  
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const { title, description, category, location, date, status } = req.body;
  
  const item = await Item.findById(req.params.id);
  
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  // Check if user is owner or admin
  if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  item.title = title || item.title;
  item.description = description || item.description;
  item.category = category || item.category;
  item.location = location || item.location;
  item.date = date || item.date;
  item.status = status || item.status;
  
  const updatedItem = await item.save();
  res.json(updatedItem);
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  // Check if user is owner or admin
  if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  await Item.deleteOne({ _id: item._id });
  res.json({ message: 'Item removed' });
});

// @desc    Get user's items
// @route   GET /api/items/myitems
// @access  Private
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ postedBy: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(items);
});

// @desc    Match items using simple image similarity
// @route   POST /api/items/match
// @access  Private
const matchItems = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  
  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  // Find potential matches (same category and opposite type)
  const potentialMatches = await Item.find({
    category: item.category,
    type: item.type === 'lost' ? 'found' : 'lost',
    status: 'pending'
  }).populate('postedBy', 'name email');
  
  // In a real implementation, we would use image embeddings for similarity
  // For this example, we'll just return items with same category
  res.json(potentialMatches);
});

// @desc    Mark item as matched
// @route   PUT /api/items/:id/match
// @access  Private
const markAsMatched = asyncHandler(async (req, res) => {
  const { matchedWithId } = req.body;
  
  const item = await Item.findById(req.params.id);
  const matchedItem = await Item.findById(matchedWithId);
  
  if (!item || !matchedItem) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  // Update both items as matched
  item.status = 'matched';
  item.matchedWith = matchedWithId;
  await item.save();
  
  matchedItem.status = 'matched';
  matchedItem.matchedWith = req.params.id;
  await matchedItem.save();
  
  // Create notifications for both users
  await Notification.create({
    user: item.postedBy,
    item: item._id,
    message: `Your ${item.type} item "${item.title}" has been matched with a ${matchedItem.type} item.`
  });
  
  await Notification.create({
    user: matchedItem.postedBy,
    item: matchedItem._id,
    message: `Your ${matchedItem.type} item "${matchedItem.title}" has been matched with a ${item.type} item.`
  });
  
  res.json({ message: 'Items matched successfully' });
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  matchItems,
  markAsMatched
};
