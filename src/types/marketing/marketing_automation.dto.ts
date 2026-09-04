export interface IAutomationCampaignDto {
  id?: number;
  name?: string;
  trigger_type?: string;
  status?: 'Active' | 'Paused' | 'Draft';
  target_model?: string;
}

export interface IWorkflowActivityDto {
  id?: number;
  campaign_id?: number;
  activity_name?: string;
  action_type?: 'Email' | 'SMS' | 'Notification' | 'Webhook';
  delay_hours?: number;
  condition?: 'Opened' | 'Clicked' | 'Always';
}
