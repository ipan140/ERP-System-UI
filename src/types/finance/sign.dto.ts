export interface ISignatureRequestDto {
  id: number;
  name: string;
  document_title: string;
  signer_name: string;
  signer_role: string;
  status: string;
  signature_hash?: string;
  signed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface ISignRequestDto extends ISignatureRequestDto {}
