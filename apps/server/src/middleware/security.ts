import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
export const configureSecurity = (app: Express) => {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
          callback(null, true);
        } else {
          callback(null, config.clientUrl === origin);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindow,
      max: config.rateLimitMax,
      message: {
        success: false,
        message: 'Too many requests, please try again later',
        errors: ['Rate limit exceeded'],
      },
    })
  );
};
