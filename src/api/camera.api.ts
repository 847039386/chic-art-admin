import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code? :number
};

export const httpCameraAll = (data :object) => {
  return http.request<Result>("post", baseUrlApi(`camera/list`), { data });
};

export const httpCameraAdd = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`camera/add`),{data});
};

export const httpCameraDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('camera/del'), { params: { id } });
};

export const httpCameraUpdate = (data?: object) => {
  return http.request<Result>("patch", baseUrlApi(`camera/up_info`),{data});
};

export const httpCompanyCameraAll = (data) => {
  return http.request<Result>("post", baseUrlApi(`camera/clist`), { data  });
};




