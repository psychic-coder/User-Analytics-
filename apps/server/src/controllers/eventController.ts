import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService';
import { validateEvent } from '../utils/validation';
export class EventController {
  async storeEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateEvent(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors.map((e: any) => e.message),
        });
      }
      await eventService.storeEvent(validation.data);
      return res.status(201).json({
        success: true,
        message: 'Event stored successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await eventService.getSessions(page, limit);
      return res.json({
        success: true,
        data: result.sessions,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getSessionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId;
      const result = await eventService.getSessionDetails(sessionId);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getHeatmapData(req: Request, res: Response, next: NextFunction) {
    try {
      const pageUrl = req.query.pageUrl as string;
      if (!pageUrl) {
        return res.status(400).json({
          success: false,
          message: 'pageUrl query parameter is required',
          errors: ['Missing pageUrl parameter'],
        });
      }
      const result = await eventService.getHeatmapData(pageUrl);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
export const eventController = new EventController();
