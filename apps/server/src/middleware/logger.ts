import morgan, { TokenIndexer } from 'morgan';
import { Request, Response } from 'express';

export const requestLogger = morgan(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response): string => {
    return [
      new Date().toISOString(),
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res) + 'ms',
    ].join(' ');
  },
  {
    skip: (_req: Request, res: Response) => {
      return process.env.NODE_ENV === 'production' && res.statusCode === 200;
    },
  }
);
