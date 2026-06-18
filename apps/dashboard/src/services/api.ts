import axios from 'axios';
import { SessionListResponse, SessionDetailsResponse, HeatmapData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getSessions = async (page = 1, limit = 20): Promise<SessionListResponse> => {
  const { data } = await api.get(`/sessions?page=${page}&limit=${limit}`);
  return data;
};

export const getSessionDetails = async (sessionId: string): Promise<SessionDetailsResponse> => {
  const { data } = await api.get(`/sessions/${sessionId}`);
  return data;
};

export const getHeatmapData = async (pageUrl: string): Promise<{ success: boolean; data: HeatmapData[] }> => {
  const { data } = await api.get(`/heatmap?pageUrl=${encodeURIComponent(pageUrl)}`);
  return data;
};
