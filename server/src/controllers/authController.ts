import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { ApiResponse } from '@/utils/ApiResponse';
import { User } from '@/models/User';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { user, token } = await AuthService.register(req.body);
    ApiResponse.created(res, 'User registered successfully', { user, token });
  }

  static async login(req: Request, res: Response) {
    const { user, token } = await AuthService.login(req.body);
    ApiResponse.ok(res, 'Login successful', { user, token });
  }

  static async getMe(req: Request, res: Response) {
    // req.user is populated by the auth middleware
    ApiResponse.ok(res, 'User profile fetched', req.user);
  }

  static async getUsers(req: Request, res: Response) {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    ApiResponse.ok(res, 'Users fetched successfully', users);
  }
}
