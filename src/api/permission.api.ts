import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: [];
  message?: string;
  code? :number
};

export const httpPermissionAll = () => {
  return http.request<Result>("get", baseUrlApi(`permission/tree`));
};

export const httpPermissionAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`permission/add`),{data});
};

export const httpPermissionDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi(`permission/del`),{ data :{ id} });
};
