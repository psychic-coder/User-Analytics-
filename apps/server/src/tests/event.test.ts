import request from 'supertest';
import app from '../app';
import { Event } from '../models/Event';

describe('Event API Tests', () => {
  it('should store a page_view event', async () => {
    const res = await request(app).post('/api/events').send({
      sessionId: 'test-session-1',
      eventType: 'page_view',
      pageUrl: 'http://localhost/test',
      timestamp: new Date().toISOString()
    });
    expect(res.status).toBe(201);
    
    const count = await Event.countDocuments();
    expect(count).toBe(1);
  });

  it('should reject click event without coordinates', async () => {
    const res = await request(app).post('/api/events').send({
      sessionId: 'test-session-2',
      eventType: 'click',
      pageUrl: 'http://localhost/test',
      timestamp: new Date().toISOString()
    });
    expect(res.status).toBe(400);
  });

  it('should get sessions list', async () => {
    await Event.create({
      sessionId: 'test-session-3',
      eventType: 'page_view',
      pageUrl: 'http://localhost/test',
      timestamp: new Date()
    });

    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
