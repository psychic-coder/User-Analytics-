import { Event, IEvent } from '../models/Event';

export class EventRepository {
  async create(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = await Event.create(eventData);
    return event;
  }

  async findAll(options: { page: number; limit: number }): Promise<{ sessions: any[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
          firstEvent: { $min: '$timestamp' },
          lastEvent: { $max: '$timestamp' },
        },
      },
      {
        $sort: { lastEvent: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          sessionId: '$_id',
          totalEvents: 1,
          firstEvent: 1,
          lastEvent: 1,
          _id: 0
        },
      },
    ]);

    const totalSessions = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
        },
      },
      {
        $count: 'total',
      },
    ]);

    const total = totalSessions[0]?.total || 0;

    return { sessions, total };
  }

  async findBySessionId(sessionId: string): Promise<any[]> {
    const events = await Event.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();
    return events;
  }

  async findHeatmapData(pageUrl: string): Promise<{ x: number; y: number }[]> {
    const clickEvents = await Event.aggregate([
      {
        $match: {
          eventType: 'click',
          pageUrl: pageUrl,
        },
      },
      {
        $project: {
          _id: 0,
          x: '$coordinates.x',
          y: '$coordinates.y',
        },
      },
    ]);

    return clickEvents;
  }
}

export const eventRepository = new EventRepository();
