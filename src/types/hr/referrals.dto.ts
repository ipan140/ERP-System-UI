export interface IReferralPointDto {
  applicant_id?: number;
  applicant?: any;
  created_at?: string;
  employee_id?: number;
  employee?: any;
  id?: number;
  points?: number;
  reason?: string;
}

export interface IReferralRewardDto {
  cost?: number;
  created_at?: string;
  id?: number;
  is_active?: boolean;
  name?: string;
}
