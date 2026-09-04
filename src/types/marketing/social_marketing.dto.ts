export interface ISocialPostDto {
  id?: number;
  message?: string;
  image_url?: string;
  channels?: string;
  post_to_facebook?: boolean;
  post_to_instagram?: boolean;
  post_to_twitter?: boolean;
  post_to_linkedin?: boolean;
  status?: 'Draft' | 'In-Review' | 'Scheduled' | 'Published';
  scheduled_at?: string | null;
  reach_count?: number;
}
