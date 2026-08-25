export interface ISurveyDto {
  created_at?: string;
  description?: string;
  id?: number;
  state?: string;
  title?: string;
  user?: IUserDto;
  user_id?: number;
}
