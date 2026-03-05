const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential Suite', 'Family Room']
  },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true, min: 1, max: 10 },
  pricePerNight: { type: Number, required: true },
  description: { type: String },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Air Conditioning', 'TV', 'Balcony', 'Mini Bar', 'Jacuzzi', 'Kitchen', 'Safe', 'Gym Access', 'Pool Access']
  }],
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  isActive: { type: Boolean, default: true },
  size: { type: Number }, // in sq ft
  bedType: { type: String, enum: ['Single', 'Double', 'Queen', 'King', 'Twin'] },
  view: { type: String, enum: ['City View', 'Garden View', 'Pool View', 'Sea View', 'Mountain View'] }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);