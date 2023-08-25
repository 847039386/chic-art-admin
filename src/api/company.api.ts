import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpCompanyAll = (data :object) => {
  return http.request<Result>("post", baseUrlApi(`company/list`), { data });
};

export const httpCompanyCensorList = (data :object) => {
  return http.request<Result>("post", baseUrlApi(`company/list_audit_allow`), { data });
};

export const httpCompanyCensorAllow = (id: string) => {
  return http.request<Result>("patch", baseUrlApi(`company/up_audit_allow`), { params: { id } });
};

export const httpCompanyCensorNotAllow = (id: string) => {
  return http.request<Result>("patch", baseUrlApi(`company/up_audit_not_allow`), { params: { id } });
};


 