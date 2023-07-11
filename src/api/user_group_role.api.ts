import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};


export const httpUserGroupRoleAdd = (user_group_id: string ,role_id :string) => {
  return http.request<Result>("post", baseUrlApi(`user-group-role/add`),{data :{ user_group_id, role_id}});
};

export const httpUserGroupRoleDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi(`user-group-role/del/${id}`));
};

export const httpUserGroupRoleByUserGroupId = (user_group_id: string) => {
  return http.request<Result>("get", baseUrlApi(`user-group-role/role/${user_group_id}`));
};
