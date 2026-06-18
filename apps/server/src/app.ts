import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { config } from './config';
import { configureSecurity } from './middleware/security';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './utils/errorHandler';
import eventRoutes from './routes/eventRoutes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configureSecurity(app);
app.use(requestLogger);

app.use('/api', eventRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [`${req.method} ${req.path} does not exist`],
  });
});

app.use(errorHandler);

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
    });
  }
};

startServer();

export default app;
