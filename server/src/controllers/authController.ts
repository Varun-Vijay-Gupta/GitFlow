import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, JwtPayload } from '../types';

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sanitizeUser = (user: InstanceType<typeof User>) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: string;
  };

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role === 'admin' ? 'admin' : 'sales',
  });

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: sanitizeUser(user), token },
  });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const token = signToken(payload);
  setTokenCookie(res, token);

  res.json({
    success: true,
    message: 'Login successful',
    data: { user: sanitizeUser(user), token },
  });
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: env.isProduction ? 'none' : 'lax',
    secure: env.isProduction,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
};
