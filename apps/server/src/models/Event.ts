import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  sessionId: string;
  eventType: 'page_view' | 'click';
  pageUrl: string;
  timestamp: Date;
  coordinates?: {
    x: number;
    y: number;
  };
}

const EventSchema: Schema<IEvent> = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    maxlength: 100,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'click'],
    index: true,
  },
  pageUrl: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
    default: Date.now,
  },
  coordinates: {
    x: {
      type: Number,
      min: 0,
    },
    y: {
      type: Number,
      min: 0,
    },
  },
});

EventSchema.index({ sessionId: 1, timestamp: -1 });
EventSchema.index({ pageUrl: 1, timestamp: -1 });
EventSchema.index({ eventType: 1, pageUrl: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
