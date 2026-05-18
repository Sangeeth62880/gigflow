import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('User role not authorized to access this route'));
    }

    next();
  };
}
