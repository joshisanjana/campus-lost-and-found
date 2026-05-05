const express = require('express');
const router = express.Router();
const { 
  getUsers,
  verifyUser,
  getItems,
  deleteItem
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id/verify')
  .put(protect, admin, verifyUser);

router.route('/items')
  .get(protect, admin, getItems);

router.route('/items/:id')
  .delete(protect, admin, deleteItem);

module.exports = router;
