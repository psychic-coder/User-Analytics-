import morgan from 'morgan';
import { Request, Response } from 'express';

const morganFormatter = (
  method: string,
  url: string,
  statusCode: string,
  _length: string,
  date: string,
  _sv: string
) => {
  const timestamp = new Date(date).toISOString();
  return `${timestamp} ${method} ${url} ${statusCode}`;
};

export const requestLogger = morgan(morganFormatter, {
  skip: (req: Request, res: Response) => {
    return process.env.NODE_ENV === 'production' && res.statusCode === 200;
  },
});
