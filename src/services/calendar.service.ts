import { http } from './http';
import type { ICalendarDto, ICalendarPayloadDto } from '@/types/core/calendar.dto';
import type { IResponse } from '@/types';

export const fetchEvents = async (resModel: string): Promise<ICalendarDto[]> => {
  const { data } = await http.get<ICalendarDto[]>(`/calendar/events?res_model=${resModel}`);
  return data;
};

export const createEvent = async (eventData: ICalendarPayloadDto): Promise<IResponse<ICalendarDto>> => {
  const { data } = await http.post<IResponse<ICalendarDto>>('/calendar/events', eventData);
  return data;
};

export const updateEvent = async (id: string | number, eventData: ICalendarPayloadDto): Promise<IResponse<ICalendarDto>> => {
  const { data } = await http.put<IResponse<ICalendarDto>>(`/calendar/events/${id}`, eventData);
  return data;
};

export const deleteEvent = async (id: string | number): Promise<IResponse<void>> => {
  const { data } = await http.delete<IResponse<void>>(`/calendar/events/${id}`);
  return data;
};
