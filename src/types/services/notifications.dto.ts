export interface INotificationLogDto {
  id?: number;
  company_id?: number;
  channel: 'whatsapp' | 'email';
  recipient: string;
  recipient_name?: string;
  entity_type?: string;
  entity_id?: number;
  subject?: string;
  message: string;
  status?: 'sent' | 'queued' | 'failed';
  error_message?: string;
  created_at?: string;
}
