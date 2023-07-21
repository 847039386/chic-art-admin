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
  return http.request<Result>("post", baseUrlApi(`company/censor_list`), { data });
};

export const httpCompanyCensorAllow = (id: string) => {
  return http.request<Result>("patch", baseUrlApi(`company/up_censor_allow`), { params: { id } });
};

export const httpCompanyCensorNotAllow = (id: string) => {
  return http.request<Result>("patch", baseUrlApi(`company/up_censor_not_allow`), { params: { id } });
};


// export const httpCompanyAdd = (data?: object) => {
//   return http.request<Result>("post", baseUrlApi(`company/add`),{data});
// };

// export const httpCompanyDel = (id: string) => {
//   return http.request<Result>("delete", baseUrlApi('company/del'), { params: { id } });
// };

// export const httpCompanyUpdate = (data?: object) => {
//   return http.request<Result>("patch", baseUrlApi(`company/up_info`),{data});
// };



