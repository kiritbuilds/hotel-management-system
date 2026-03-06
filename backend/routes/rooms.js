const express = require('express');
const router = express.Router();
const { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getRoomStats } = require('../controllers/roomController');
const { protect, adminOnly, staffOrAdmin } = require('../middleware/auth');

router.get('/', getRooms);
router.get('/stats', protect, staffOrAdmin, getRoomStats);
router.get('/:id', getRoom);
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', staffOrAdmin, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;