import { Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { AuthRequest, UserRole } from '../types';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action')
      );
    }

    next();
  };
};

/** Sales can read and create; admin has full access */
export const canModifyLead = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new ApiError(401, 'Not authorized'));
  }

  if (req.user.role === 'admin') {
    return next();
  }

  return next(
    new ApiError(403, 'Sales users can only create and view leads')
  );
};

export const canDeleteLead = authorize('admin');
