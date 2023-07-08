import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpPermissionAll = () => {
  return http.request<Result>("get", baseUrlApi(`permission/list`));
};

export const httpPermissionAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`permission/add`),{data});
};

export const httpPermissionDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi(`permission/del/${id}`));
};

export const httpPermissionUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`permission/up_info`),{data});
};

export const httpPermissionUpAvailable = (id :string, available:boolean) => {
  return http.request<Result>("patch", baseUrlApi(`permission/up_available`),{ data :{ id ,available} });
}
