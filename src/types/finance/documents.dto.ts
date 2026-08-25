export interface IFinanceDocumentDto {
  created_at?: string;
  id?: number;
  name?: string;
  partner?: IPartnerDto;
  partner_id?: number;
}

export interface IWorkspaceDto {
  created_at?: string;
  id?: number;
  name?: string;
}
