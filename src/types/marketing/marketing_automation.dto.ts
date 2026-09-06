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
  action_type?: 'Email' | 'WhatsApp' | 'SMS' | 'Notification' | 'CRM_Task' | 'Webhook';
  channel?: 'Email' | 'WhatsApp' | 'SMS' | 'CRM';
  target_template_id?: number;
  action_payload?: string;
  delay_hours?: number;
  condition?: 'Opened' | 'Clicked' | 'Always' | 'Not_Replied';
}

export interface IJourneyLogDto {
  id?: number;
  campaign_id?: number;
  activity_id?: number;
  lead_name?: string;
  lead_contact?: string;
  channel?: string;
  action_name?: string;
  status?: string;
  executed_at?: string;
}

