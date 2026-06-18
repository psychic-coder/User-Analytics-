import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public errors: any[];

  constructor(statusCode: number, message: string, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: [err.message],
    });
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      errors: ['Malformed JSON in request body'],
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: [err.message || 'Something went wrong'],
  });
};
