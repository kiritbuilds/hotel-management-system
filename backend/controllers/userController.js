const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all guests (Admin)
// @route   GET /api/users
const getAllGuests = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    let query = {};
    if (role) query.role = role;
    else query.role = 'guest';
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single guest with bookings
// @route   GET /api/users/:id
const getGuest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const bookings = await Booking.find({ guest: user._id })
      .populate('room', 'roomNumber type pricePerNight')
      .sort({ createdAt: -1 });

    res.json({ success: true, user, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update guest status or role (Admin)
// @route   PUT /api/users/:id
const updateGuest = async (req, res) => {
  try {
    const { isActive, role, loyaltyPoints } = req.body;
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role) updateData.role = role;
    if (loyaltyPoints !== undefined) updateData.loyaltyPoints = loyaltyPoints;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create staff account (Admin)
// @route   POST /api/users/staff
const createStaff = async (req, res) => {
  try {
    const { username, password, fullName, email, phone } = req.body;
    const user = await User.create({
      username, password, fullName, email, phone,
      role: 'staff', nationality: 'Indian'
    });
    res.status(201).json({ success: true, message: 'Staff account created', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllGuests, getGuest, updateGuest, createStaff };