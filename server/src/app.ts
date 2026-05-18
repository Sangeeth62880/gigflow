import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import authRoutes from '@/routes/auth';
import leadsRoutes from '@/routes/leads';

const app = express();

// Core middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 auth requests per window
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  ApiResponse.ok(res, 'OK');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
