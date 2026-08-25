export interface IReferralPointDto {
  applicant_id?: number;
  created_at?: string;
  employee_id?: number;
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
