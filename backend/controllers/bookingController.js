const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check for conflicts
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        { checkInDate: { $lte: new Date(checkOutDate) }, checkOutDate: { $gte: new Date(checkInDate) } }
      ]
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'Room is not available for selected dates' });
    }

    const booking = await Booking.create({
      guest: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      pricePerNight: room.pricePerNight,
      specialRequests,
      status: 'confirmed'
    });

    await Room.findByIdAndUpdate(roomId, { status: 'reserved' });
    await booking.populate(['room', 'guest']);
    res.status(201).json({ success: true, message: 'Booking confirmed!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin/Staff)
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('guest', 'fullName email phone username')
      .populate('room', 'roomNumber type floor pricePerNight')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my bookings (Guest)
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('room', 'roomNumber type floor pricePerNight images amenities')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guest', 'fullName email phone username nationality idType idNumber')
      .populate('room');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Check access: guest can only view own bookings
    if (req.user.role === 'guest' && booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin/Staff)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, paymentMethod, notes } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    if (notes) booking.notes = notes;

    // Handle check-in/check-out
    if (status === 'checked-in') {
      booking.actualCheckIn = new Date();
      await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });
    } else if (status === 'checked-out') {
      booking.actualCheckOut = new Date();
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
      // Add loyalty points (1 point per 100 rupees spent)
      const points = Math.floor(booking.finalAmount / 100);
      await User.findByIdAndUpdate(booking.guest, {
        $inc: { loyaltyPoints: points, totalSpent: booking.finalAmount }
      });
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date();
      await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    }

    await booking.save();
    await booking.populate(['guest', 'room']);
    res.json({ success: true, message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking (Guest)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    booking.cancelledAt = new Date();
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });
    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/bookings/dashboard-stats
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIns = await Booking.find({
      checkInDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'checked-in'] }
    }).populate('guest', 'fullName').populate('room', 'roomNumber type');

    const todayCheckOuts = await Booking.find({
      checkOutDate: { $gte: today, $lt: tomorrow },
      status: 'checked-in'
    }).populate('guest', 'fullName').populate('room', 'roomNumber type');

    const recentBookings = await Booking.find()
      .populate('guest', 'fullName email')
      .populate('room', 'roomNumber type')
      .sort({ createdAt: -1 })
      .limit(10);

    const totalGuests = await User.countDocuments({ role: 'guest', isActive: true });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'checked-in', 'checked-out'] } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        todayCheckIns,
        todayCheckOuts,
        recentBookings,
        totalGuests,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getAllBookings, getMyBookings, getBooking, updateBookingStatus, cancelBooking, getDashboardStats };