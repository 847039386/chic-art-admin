import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpUserGroupAll = () => {
  return http.request<Result>("get", baseUrlApi(`user-group/list`));
};

export const httpUserGroupAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`user-group/add`),{data});
};

export const httpUserGroupDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi(`user-group/del/${id}`));
};

export const httpUserGroupUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`user-group/up_info`),{data});
};

export const httpUserGroupUpAvailable = (id :string, available:boolean) => {
  return http.request<Result>("patch", baseUrlApi(`user-group/up_available`),{ data :{ id ,available} });
}

