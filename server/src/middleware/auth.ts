import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';
import { User, IUser } from '@/models/User';

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized to access this route'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized('The user belonging to this token no longer exists.'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error); // errorHandler will catch JsonWebTokenError and TokenExpiredError
  }
}

export function restrictTo(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
}
