const express = require('express');
const router = express.Router();
const { getAllGuests, getGuest, updateGuest, createStaff } = require('../controllers/userController');
const { protect, adminOnly, staffOrAdmin } = require('../middleware/auth');

router.use(protect);
router.get('/', staffOrAdmin, getAllGuests);
router.post('/staff', adminOnly, createStaff);
router.get('/:id', staffOrAdmin, getGuest);
router.put('/:id', adminOnly, updateGuest);

module.exports = router;