export interface IRolePermissionDto {
  can_delete?: boolean;
  can_read?: boolean;
  can_write?: boolean;
  id?: number;
  module?: string;
  role_name?: string;
}

export interface ITogglePermissionRequestDto {
  action?: string;
  module?: string;
  role_name?: string;
  value?: boolean;
}
