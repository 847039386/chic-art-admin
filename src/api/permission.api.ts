import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: [];
};

export const httpPermissionAll = () => {
  return http.request<Result>("get", baseUrlApi(`permission/list`));
};

