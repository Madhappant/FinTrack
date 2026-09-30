import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

// Default categories to seed when a new user registers
const DEFAULT_CATEGORIES = [
  // Income
  { name: 'Client Retainer', type: 'INCOME', color: '#10B981', icon: 'briefcase', isDefault: true },
  { name: 'Project Milestone', type: 'INCOME', color: '#059669', icon: 'check-circle', isDefault: true },
  { name: 'Consulting', type: 'INCOME', color: '#3B82F6', icon: 'user-check', isDefault: true },
  { name: 'Product Sales', type: 'INCOME', color: '#6366F1', icon: 'shopping-bag', isDefault: true },
  { name: 'Other Income', type: 'INCOME', color: '#8B5CF6', icon: 'dollar-sign', isDefault: true },

  // Expenses
  { name: 'Software & Tools', type: 'EXPENSE', color: '#EF4444', icon: 'code', isDefault: true },
  { name: 'Office Rent & Coworking', type: 'EXPENSE', color: '#F97316', icon: 'home', isDefault: true },
  { name: 'Salaries & Contractors', type: 'EXPENSE', color: '#F59E0B', icon: 'users', isDefault: true },
  { name: 'Internet & Utilities', type: 'EXPENSE', color: '#EAB308', icon: 'wifi', isDefault: true },
  { name: 'Travel & Commute', type: 'EXPENSE', color: '#84CC16', icon: 'navigation', isDefault: true },
  { name: 'Marketing & Ads', type: 'EXPENSE', color: '#06B6D4', icon: 'trending-up', isDefault: true },
  { name: 'Taxes & Compliance', type: 'EXPENSE', color: '#DC2626', icon: 'file-text', isDefault: true },
  { name: 'Miscellaneous', type: 'EXPENSE', color: '#6B7280', icon: 'more-horizontal', isDefault: true }
];

export const register = async (req, res) => {
  try {
    const { name, email, password, businessName, currency, phone, gstNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName: businessName || `${name}'s Agency`,
        currency: currency || 'INR',
        phone,
        gstNumber,
        categories: {
          create: DEFAULT_CATEGORIES
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        currency: true,
        phone: true,
        gstNumber: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'sugan_secret_jwt',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'sugan_secret_jwt',
      { expiresIn: '30d' }
    );

    const { password: _, ...userData } = user;

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        currency: true,
        phone: true,
        gstNumber: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile.', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, businessName, currency, phone, gstNumber } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, businessName, currency, phone, gstNumber },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        currency: true,
        phone: true,
        gstNumber: true
      }
    });
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.', error: err.message });
  }
};
