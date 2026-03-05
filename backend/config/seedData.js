require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected for seeding...');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Room.deleteMany({});

  console.log('Cleared existing data...');

  // Create Users
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      fullName: 'Hotel Administrator',
      email: 'admin@grandpalace.com',
      phone: '9876543210',
      nationality: 'Indian',
      role: 'admin',
      idType: 'Aadhar',
      idNumber: 'ADMIN001'
    },
    {
      username: 'staff',
      password: 'staff123',
      fullName: 'Hotel Staff',
      email: 'staff@grandpalace.com',
      phone: '9876543211',
      nationality: 'Indian',
      role: 'staff',
      idType: 'Aadhar',
      idNumber: 'STAFF001'
    },
    {
      username: 'guest',
      password: 'guest123',
      fullName: 'Demo Guest',
      email: 'guest@example.com',
      phone: '9876543212',
      nationality: 'Indian',
      role: 'guest',
      idType: 'Passport',
      idNumber: 'P123456',
      loyaltyPoints: 750,
      loyaltyStatus: 'Gold',
      totalSpent: 45600
    }
  ];

  const createdUsers = await User.create(users);
  console.log(`✅ Created ${createdUsers.length} users`);

  // Create Rooms
  const rooms = [
    { roomNumber: '101', type: 'Standard', floor: 1, capacity: 2, pricePerNight: 2500, bedType: 'Double', view: 'Garden View', amenities: ['WiFi', 'Air Conditioning', 'TV'], description: 'Comfortable standard room with garden view', size: 280 },
    { roomNumber: '102', type: 'Standard', floor: 1, capacity: 2, pricePerNight: 2500, bedType: 'Twin', view: 'Garden View', amenities: ['WiFi', 'Air Conditioning', 'TV'], description: 'Comfortable standard room with twin beds', size: 280 },
    { roomNumber: '201', type: 'Deluxe', floor: 2, capacity: 2, pricePerNight: 4500, bedType: 'King', view: 'City View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony'], description: 'Spacious deluxe room with city view and balcony', size: 380 },
    { roomNumber: '202', type: 'Deluxe', floor: 2, capacity: 3, pricePerNight: 5000, bedType: 'King', view: 'Pool View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony', 'Pool Access'], description: 'Deluxe room with stunning pool view', size: 400 },
    { roomNumber: '301', type: 'Suite', floor: 3, capacity: 4, pricePerNight: 8500, bedType: 'King', view: 'City View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Safe'], description: 'Luxurious suite with separate living area', size: 650 },
    { roomNumber: '302', type: 'Suite', floor: 3, capacity: 4, pricePerNight: 9000, bedType: 'King', view: 'Pool View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Pool Access', 'Safe'], description: 'Premium suite with pool view and jacuzzi', size: 700 },
    { roomNumber: '401', type: 'Presidential Suite', floor: 4, capacity: 6, pricePerNight: 15000, bedType: 'King', view: 'City View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Kitchen', 'Safe', 'Gym Access', 'Pool Access'], description: 'Ultimate luxury with panoramic city views and all amenities', size: 1200 },
    { roomNumber: '103', type: 'Family Room', floor: 1, capacity: 5, pricePerNight: 6500, bedType: 'Queen', view: 'Garden View', amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe'], description: 'Spacious family room perfect for families with children', size: 550 },
  ];

  const createdRooms = await Room.create(rooms);
  console.log(`✅ Created ${createdRooms.length} rooms`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('  Admin   → username: admin   | password: admin123');
  console.log('  Staff   → username: staff   | password: staff123');
  console.log('  Guest   → username: guest   | password: guest123');

  process.exit(0);
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});