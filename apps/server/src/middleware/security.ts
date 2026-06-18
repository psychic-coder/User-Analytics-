import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const configureSecurity = (app: Express) => {
  app.use(helmet());

  app.use(
    cors({
      origin: config.clientUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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
