import { z } from 'zod';

export const eventValidationSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(100, 'Session ID must be less than 100 characters'),
  
  eventType: z
    .enum(['page_view', 'click'], {
      errorMap: () => ({ message: 'Event type must be "page_view" or "click"' }),
    }),
  
  pageUrl: z
    .string()
    .url('Page URL must be a valid URL')
    .min(1, 'Page URL is required'),
  
  timestamp: z
    .string()
    .datetime({ message: 'Timestamp must be a valid ISO string' }),
  
  coordinates: z
    .object({
      x: z.number().min(0, 'X coordinate must be >= 0'),
      y: z.number().min(0, 'Y coordinate must be >= 0'),
    })
    .optional(),
}).refine(data => {
  if (data.eventType === 'click' && (!data.coordinates || data.coordinates.x === undefined || data.coordinates.y === undefined)) {
    return false;
  }
  return true;
}, {
  message: "Coordinates are required for click events",
  path: ["coordinates"]
});

export type EventPayload = z.infer<typeof eventValidationSchema>;

export const validateEvent = (data: unknown) => {
  return eventValidationSchema.safeParse(data);
};
