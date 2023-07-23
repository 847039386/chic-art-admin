import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  message: string;
  code: string;
  data?: {
    /** 列表数据 */
    currentPage?: number
    pageSize?: number,
    total?: number,
    rows?: [],
    
  };
};

export const httpOperatorLogAll = (page: number, limit: number) => {
  return http.request<Result>("get", baseUrlApi(`operator-log/list?page=${page}&limit=${limit}`));
};

export const httpClearedOperatorLog = () => {
  return http.request<Result>("delete", baseUrlApi(`operator-log/cleared`));
};



