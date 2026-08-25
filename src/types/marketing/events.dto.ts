export interface IEventDto {
  id?: number;
}

export interface IEventTicketDto {
  barcode?: string;
  customer?: any;
  customer_id?: number;
  event?: any;
  event_id?: number;
  id?: number;
  is_scanned?: boolean;
}
