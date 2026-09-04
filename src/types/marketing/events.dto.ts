export interface IEventDto {
  id?: number;
  event_name?: string;
  location?: string;
  max_capacity?: number;
  event_date?: string;
  status?: 'Open' | 'Ongoing' | 'Completed';
}

export interface IEventTicketDto {
  id?: number;
  event_id?: number;
  event?: IEventDto;
  customer_id?: number;
  customer?: any;
  attendee_name?: string;
  attendee_email?: string;
  barcode?: string;
  is_scanned?: boolean;
}
