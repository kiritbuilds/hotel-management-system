const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms (with filters)
// @route   GET /api/rooms
const getRooms = async (req, res) => {
  try {
    const { type, status, minPrice, maxPrice, amenities, checkIn, checkOut, guests } = req.query;
    let query = { isActive: true };

    if (type) query.type = type;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (amenities) query.amenities = { $all: amenities.split(',') };
    if (guests) query.capacity = { $gte: Number(guests) };

    // If dates provided, filter out booked rooms
    if (checkIn && checkOut) {
      const bookedRooms = await Booking.find({
        status: { $in: ['confirmed', 'checked-in'] },
        $or: [
          { checkInDate: { $lte: new Date(checkOut) }, checkOutDate: { $gte: new Date(checkIn) } }
        ]
      }).select('room');
      const bookedRoomIds = bookedRooms.map(b => b.room);
      query._id = { $nin: bookedRoomIds };
    }

    const rooms = await Room.find(query).sort({ pricePerNight: 1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create room (Admin)
// @route   POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room (Admin)
// @route   PUT /api/rooms/:id
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room (Admin)
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get room stats (Admin Dashboard)
// @route   GET /api/rooms/stats
const getRoomStats = async (req, res) => {
  try {
    const total = await Room.countDocuments({ isActive: true });
    const available = await Room.countDocuments({ isActive: true, status: 'available' });
    const occupied = await Room.countDocuments({ isActive: true, status: 'occupied' });
    const maintenance = await Room.countDocuments({ isActive: true, status: 'maintenance' });
    res.json({ success: true, stats: { total, available, occupied, maintenance } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getRoomStats };