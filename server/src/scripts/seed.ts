import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { LeadSource, LeadStatus } from '../types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/gigflow';

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const sampleNames = [
  'Rahul Sharma',
  'Priya Patel',
  'Amit Kumar',
  'Sneha Reddy',
  'Vikram Singh',
  'Ananya Iyer',
  'Karan Mehta',
  'Divya Nair',
  'Arjun Desai',
  'Meera Joshi',
  'Rohan Gupta',
  'Kavya Rao',
  'Suresh Menon',
  'Lakshmi Pillai',
  'Deepak Verma',
  'Neha Kapoor',
  'Sanjay Malhotra',
  'Pooja Bansal',
  'Manish Agarwal',
  'Ritu Chawla',
  'Aditya Bose',
  'Shreya Das',
  'Nitin Khanna',
  'Isha Trivedi',
  'Gaurav Saxena',
];

const seed = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const adminPassword = await bcrypt.hash('Admin123', 12);
  const salesPassword = await bcrypt.hash('Sales123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.com',
    password: adminPassword,
    role: 'admin',
  });

  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@test.com',
    password: salesPassword,
    role: 'sales',
  });

  const leads = sampleNames.map((name, index) => {
    const firstName = name.split(' ')[0].toLowerCase();
    return {
      name,
      email: `${firstName}${index + 1}@example.com`,
      status: statuses[index % statuses.length],
      source: sources[index % sources.length],
      createdBy: index % 2 === 0 ? admin._id : sales._id,
      createdAt: new Date(Date.now() - index * 86400000),
    };
  });

  await Lead.insertMany(leads);

  console.log('Seed completed:');
  console.log('  Admin: admin@test.com / Admin123');
  console.log('  Sales: sales@test.com / Sales123');
  console.log(`  ${leads.length} sample leads created`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
