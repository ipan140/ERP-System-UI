export interface ISmsCampaignDto {
  id?: number;
  name?: string;
  channel?: 'SMS' | 'WhatsApp' | 'SMS & WhatsApp';
  content?: string;
  target_audience?: string;
  status?: 'Draft' | 'In-Queue' | 'Sent';
  sent_count?: number;
  delivered_count?: number;
  created_at?: string;
}
