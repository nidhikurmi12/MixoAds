import {
  CampaignsResponse,
  CampaignResponse,
  CampaignInsightsResponse,
  OverallInsightsResponse,
  CampaignInsights
} from '../types/campaign';

const BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
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
