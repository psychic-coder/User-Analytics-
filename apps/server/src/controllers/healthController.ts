import { Request, Response } from 'express';

export class HealthController {
  async check(req: Request, res: Response) {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}

export const healthController = new HealthController();
