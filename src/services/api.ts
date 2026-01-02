import {
  CampaignsResponse,
  CampaignResponse,
  CampaignInsightsResponse,
  OverallInsightsResponse,
  CampaignInsights,
} from "../types/campaign";
import { axiosInstance } from "./axiosInstance";

async function getRequest<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<T>(url);
  console.log("API Response:", response);
  return response.data;
}

export const getCampaigns = (): Promise<CampaignsResponse> => {
  return getRequest<CampaignsResponse>("/campaigns");
};

export const getCampaign = (id: string): Promise<CampaignResponse> => {
  return getRequest<CampaignResponse>(`/campaigns/${id}`);
};

export const getOverallInsights = (): Promise<OverallInsightsResponse> => {
  return getRequest<OverallInsightsResponse>("/campaigns/insights");
};

export const getCampaignInsights = (
  id: string
): Promise<CampaignInsightsResponse> => {
  return getRequest<CampaignInsightsResponse>(
    `/campaigns/${id}/insights`
  );
};

export const streamCampaignInsights = (
  campaignId: string,
  onMessage: (data: CampaignInsights) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const baseURL =
    (import.meta.env.VITE_BASE_URL as string) ||
    "https://mixo-fe-backend-task.vercel.app";

  const eventSource = new EventSource(
    `${baseURL}/campaigns/${campaignId}/insights/stream`
  );

  eventSource.onmessage = (event) => {
    try {
      const parsedData: CampaignInsights = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (err) {
      console.error("SSE parse error:", err);
      onError?.(err as Error);
    }
  };

  eventSource.onerror = () => {
    const error = new Error("SSE connection failed");
    console.error(error);
    onError?.(error);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
};
