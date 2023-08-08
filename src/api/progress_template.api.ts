import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpProgressTemplateAll = () => {
  return http.request<Result>("get", baseUrlApi(`progress-template/list`));
};

export const httpProgressTemplateAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`progress-template/add`),{data});
};

export const httpProgressTemplateDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('progress-template/del'), { params: { id } });
};

export const httpProgressTemplateUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`progress-template/up_info`),{data});
};



