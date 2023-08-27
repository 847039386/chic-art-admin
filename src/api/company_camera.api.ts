import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpCompanyCameraAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`company-camera/add`),{data});
};

export const httpCamerasByCompany = (company_id :string ,page ?:number, limit ?:number) => {
  page = page || 1;
  limit = limit || 999
  return http.request<Result>("get", baseUrlApi(`company-camera/list_by_companyid`),{ params :{ page ,limit ,company_id } });
}


export const httpUnAssignCompany = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('company-camera/del'), { params: { id } });
};

export const httpUpdateExpireTime = (id: string ,expire_time :string) => {
  return http.request<Result>("patch", baseUrlApi('company-camera/up_expire_time'), { data: { id ,expire_time } });
};
