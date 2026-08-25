export interface IApplicantDto {
  created_at?: string;
  email?: string;
  expected_salary?: number;
  id?: number;
  job_position_id?: number;
  jobposition?: any;
  name?: string;
  phone?: string;
  stage?: any;
  stage_id?: number;
  state?: string;
}

export interface IStageDto {
  id?: number;
  name?: string;
  sequence?: number;
}
