import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};


export const httpRolePermissionAdd = (role_id: string, permission_id: string) => {
  console.log(role_id, permission_id)
  return http.request<Result>("post", baseUrlApi(`role-permission/add`),{data :{ role_id, permission_id}});
};

export const httpRolePermissionDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('role-permission/del'), { params: { id } });
};

export const httpRolePermissionByRoleId = (role_id: string) => {
  return http.request<Result>("get", baseUrlApi('role-permission/permissions'), { params: { role_id } });
};
