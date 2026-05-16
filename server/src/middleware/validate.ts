import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from '../utils/ApiError';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = errors.array().map((e) => ({
        field: 'path' in e ? String(e.path) : 'unknown',
        message: e.msg as string,
      }));
      return next(new ApiError(400, 'Validation failed', formatted));
    }

    next();
  };
};
