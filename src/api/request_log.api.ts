import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  message: string;
  code: number;
  data?: {
    /** 列表数据 */
    currentPage?: number
    pageSize?: number,
    total?: number,
    rows?:[]
  };
};

export const httpRequestLogAll = (page: number, limit: number) => {
  return http.request<Result>("get", baseUrlApi(`request-log/list`),{ params :{ page,limit } });
};

