import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, JwtPayload } from '../types';

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return next(new ApiError(401, 'Not authorized. Please log in.'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
  }
};
