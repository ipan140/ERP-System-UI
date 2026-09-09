export interface IHelpdeskCannedResponseDto {
  id?: number;
  keyword?: string;
  response?: string;
}

export interface IHelpdeskSLADto {
  id?: number;
  name?: string;
  priority_level?: string;
  target_hours?: number;
}

export interface ITicketDto {
  assignee_id?: number;
  created_at?: string;
  customer_id?: number;
  id?: number;
  issue_description?: string;
  name?: string;
  priority?: string;
  state?: string;

  // Fase 3: SLA Escalation Engine
  sla_deadline?: string;
  sla_status?: 'ok' | 'warning' | 'breached';
  escalation_level?: number;
  escalated_at?: string;
  first_response_at?: string;
  resolved_at?: string;
}

