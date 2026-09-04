export interface IApprovalRequestDto {
  id: number;
  name: string;
  type: string;
  amount: number;
  requester_name: string;
  stage: string;
  status: string;
  approver_name?: string;
  notes?: string;
  created_at: string;
}

export interface IApprovalDto extends IApprovalRequestDto {}
