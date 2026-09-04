export interface ISurveyDto {
  id?: number;
  title?: string;
  description?: string;
  gform_url?: string;
  state?: 'draft' | 'open' | 'closed';
  nps_score?: number;
  responses_count?: number;
  promoters_count?: number;
  passives_count?: number;
  detractors_count?: number;
  user_id?: number;
  created_at?: string;
}

export interface ISurveyQuestionDto {
  id?: number;
  survey_id?: number;
  question?: string;
  question_type?: 'text' | 'multiple_choice' | 'rating';
  created_at?: string;
}
