import {
  CampaignsResponse,
  CampaignResponse,
  CampaignInsightsResponse,
  OverallInsightsResponse,
  CampaignInsights,
} from '../types/campaign';
import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_BASE_URL as string) || 'https://mixo-fe-backend-task.vercel.app';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
}

export async function getCampaigns(): Promise<CampaignsResponse> {
  return fetchAPI<CampaignsResponse>('/campaigns');
}

export async function getCampaign(id: string): Promise<CampaignResponse> {
  return fetchAPI<CampaignResponse>(`/campaigns/${id}`);
}

export async function getOverallInsights(): Promise<OverallInsightsResponse> {
  return fetchAPI<OverallInsightsResponse>('/campaigns/insights');
}

export async function getCampaignInsights(id: string): Promise<CampaignInsightsResponse> {
  return fetchAPI<CampaignInsightsResponse>(`/campaigns/${id}/insights`);
}

export function streamCampaignInsights(
  campaignId: string,
  onMessage: (insights: CampaignInsights) => void,
  onError?: (error: Error) => void
): () => void {
  const eventSource = new EventSource(`${BASE_URL}/campaigns/${campaignId}/insights/stream`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing SSE data:', error);
      onError?.(error as Error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    onError?.(new Error('Stream connection error'));
  };

  return () => {
    eventSource.close();
  };
}
