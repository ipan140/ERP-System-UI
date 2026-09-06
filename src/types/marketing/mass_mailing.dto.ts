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
  budget_allocated?: number;
  actual_spend?: number;
  approval_status?: 'Draft' | 'Waiting Approval' | 'Approved' | 'Rejected';
  approved_by_id?: number | null;
  approved_at?: string | null;
  reject_reason?: string | null;
  is_ab_testing?: boolean;
  subject_b?: string;
  sample_size_pct?: number;
  winner_metric?: string;
  winner_variant?: string;
  variant_a_opened?: number;
  variant_b_opened?: number;
}

export interface IUtmTrackerDto {
  campaign?: any;
  campaign_id?: number;
  generated_revenue?: number;
  id?: number;
  utm_medium?: string;
  utm_source?: string;
}
