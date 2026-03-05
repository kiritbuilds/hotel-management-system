const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'guest'],
    default: 'guest'
  },
  fullName: { type: String, required: [true, 'Full name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
  phone: { type: String, required: [true, 'Phone number is required'] },
  nationality: { type: String, default: 'Indian' },
  address: { type: String },
  idType: { type: String, enum: ['Aadhar', 'Passport', 'PAN', 'Driving License', ''] },
  idNumber: { type: String },
  isActive: { type: Boolean, default: true },
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyStatus: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  totalSpent: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  notificationPrefs: {
    emailBookings: { type: Boolean, default: true },
    smsCheckin: { type: Boolean, default: false },
    promotions: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update loyalty status based on points
userSchema.methods.updateLoyaltyStatus = function () {
  if (this.loyaltyPoints >= 1000) this.loyaltyStatus = 'Platinum';
  else if (this.loyaltyPoints >= 750) this.loyaltyStatus = 'Gold';
  else if (this.loyaltyPoints >= 400) this.loyaltyStatus = 'Silver';
  else this.loyaltyStatus = 'Bronze';
};

module.exports = mongoose.model('User', userSchema);