const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  actualCheckIn: { type: Date },
  actualCheckOut: { type: Date },
  numberOfGuests: { type: Number, required: true, min: 1 },
  numberOfNights: { type: Number },
  pricePerNight: { type: Number, required: true },
  totalAmount: { type: Number },
  discount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  finalAmount: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Online']
  },
  specialRequests: { type: String },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  notes: { type: String } // Admin/staff notes
}, { timestamps: true });

// Auto-generate booking ID and calculate amounts before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now().toString().slice(-8);
  }
  if (this.checkInDate && this.checkOutDate) {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalAmount = this.numberOfNights * this.pricePerNight;
    this.taxAmount = Math.round(this.totalAmount * 0.12); // 12% GST
    this.finalAmount = this.totalAmount + this.taxAmount - (this.discount || 0);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);