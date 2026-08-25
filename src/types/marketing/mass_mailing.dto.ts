export interface IMailingCampaignDto {
  clicked_count?: number;
  id?: number;
  name?: string;
  opened_count?: number;
  sent_count?: number;
}

export interface IUtmTrackerDto {
  campaign?: any;
  campaign_id?: number;
  generated_revenue?: number;
  id?: number;
  utm_medium?: string;
  utm_source?: string;
}
