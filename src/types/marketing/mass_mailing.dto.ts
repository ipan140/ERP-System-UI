export interface IMailingCampaignDto {
  id?: number;
  name?: string;
  subject?: string;
  target_audience?: string;
  status?: 'Draft' | 'Scheduled' | 'In-Queue' | 'Sent';
  sent_count?: number;
  opened_count?: number;
  clicked_count?: number;
  bounced_count?: number;
  scheduled_at?: string | null;
}

export interface IUtmTrackerDto {
  campaign?: any;
  campaign_id?: number;
  generated_revenue?: number;
  id?: number;
  utm_medium?: string;
  utm_source?: string;
}
