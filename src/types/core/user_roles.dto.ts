export interface IAssignRoleRequestDto {
  roles?: string[];
  user?: any;
  user_id?: number;
}

export interface IUserRoleResponseDto {
  email?: string;
  id?: number;
  name?: string;
  roles?: string;
}
