import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpTagAll = () => {
  return http.request<Result>("get", baseUrlApi(`tag/list`));
};

export const httpTagAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`tag/add`),{data});
};

export const httpTagDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('tag/del'), { params: { id } });
};

export const httpTagUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`tag/up_info`),{data});
};



