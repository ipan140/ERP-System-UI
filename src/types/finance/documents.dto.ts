export interface IFinanceDocumentDto {
  id: number;
  name: string;
  partner_id: number;
  partner?: any;
  created_at: string;
}

export interface IWorkspaceDto {
  id: number;
  name: string;
  created_at?: string;
}
