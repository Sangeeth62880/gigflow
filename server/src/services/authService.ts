import { User, IUser } from '@/models/User';
import { ApiError } from '@/utils/ApiError';
import { env } from '@/config/env';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '@/validators/authSchemas';

export class AuthService {
  static async register(data: RegisterInput): Promise<{ user: Partial<IUser>; token: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict('Email already in use');
    }

    const user = await User.create(data);
    const token = this.generateToken(user.id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async login(data: LoginInput): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static generateToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }
}
