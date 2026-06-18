export interface Event {
  _id?: string;
  sessionId: string;
  eventType: 'page_view' | 'click';
  pageUrl: string;
  timestamp: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface SessionSummary {
  sessionId: string;
  totalEvents: number;
  firstEvent: string;
  lastEvent: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SessionListResponse {
  success: boolean;
  data: SessionSummary[];
  pagination: Pagination;
}

export interface SessionDetailsResponse {
  success: boolean;
  data: {
    sessionId: string;
    events: Event[];
  };
}

export interface HeatmapData {
  x: number;
  y: number;
}
