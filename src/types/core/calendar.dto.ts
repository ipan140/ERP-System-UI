export interface ICalendarDto {
  id?: number;
  title?: string;
  description?: string;
  location?: string;
  meeting_url?: string;
  join_token?: string;
  event_type?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  res_model?: string;
  res_id?: number;
  visibility?: string;
  user_id?: number;
  attendee_ids?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface ICalendarPayloadDto extends Omit<ICalendarDto, 'id' | 'created_at' | 'updated_at' | 'join_token'> {}
