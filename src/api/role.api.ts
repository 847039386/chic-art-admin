import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpRoleAll = () => {
  return http.request<Result>("get", baseUrlApi(`role/list`));
};

export const httpRoleAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`role/add`),{data});
};

export const httpRoleDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi(`role/del/${id}`));
};

export const httpRoleUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`role/up_info`),{data});
};

export const httpRoleUpAvailable = (id :string, available:boolean) => {
  return http.request<Result>("patch", baseUrlApi(`role/up_available`),{ data :{ id ,available} });
}
