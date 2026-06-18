import { eventRepository } from '../repositories/eventRepository';
import { EventPayload } from '../utils/validation';
import { AppError } from '../utils/errorHandler';

export class EventService {
  async storeEvent(payload: EventPayload): Promise<void> {
    try {
      await eventRepository.create({
        sessionId: payload.sessionId,
        eventType: payload.eventType,
        pageUrl: payload.pageUrl,
        timestamp: new Date(payload.timestamp),
        coordinates: payload.coordinates,
      });
    } catch (error: any) {
      throw new AppError(500, 'Failed to store event', [error.message]);
    }
  }

  async getSessions(page: number, limit: number): Promise<any> {
    try {
      return await eventRepository.findAll({ page, limit });
    } catch (error: any) {
      throw new AppError(500, 'Failed to fetch sessions', [error.message]);
    }
  }

  async getSessionDetails(sessionId: string): Promise<any> {
    try {
      const events = await eventRepository.findBySessionId(sessionId);
      return {
        sessionId,
        events,
      };
    } catch (error: any) {
      throw new AppError(500, 'Failed to fetch session details', [error.message]);
    }
  }

  async getHeatmapData(pageUrl: string): Promise<any> {
    try {
      return await eventRepository.findHeatmapData(pageUrl);
    } catch (error: any) {
      throw new AppError(500, 'Failed to fetch heatmap data', [error.message]);
    }
  }
}

export const eventService = new EventService();
