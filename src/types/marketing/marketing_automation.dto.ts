export interface IAutomationCampaignDto {
  id?: number;
}

export interface IWorkflowActivityDto {
  action_type?: string;
  campaign_id?: number;
  condition?: string;
  delay_hours?: number;
  id?: number;
}
