const express = require('express');
const router = express.Router();
const { 
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  matchItems,
  markAsMatched
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createItem)
  .get(getItems);

router.route('/myitems').get(protect, getMyItems);
router.route('/match').post(protect, matchItems);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.route('/:id/match').put(protect, markAsMatched);

module.exports = router;
