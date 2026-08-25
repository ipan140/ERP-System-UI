export interface IBlogPostDto {
  author?: IUserDto;
  author_id?: number;
  content?: string;
  created_at?: string;
  id?: number;
  published_date?: string;
  state?: string;
  title?: string;
}
