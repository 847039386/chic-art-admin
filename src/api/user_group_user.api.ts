import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code?: number
};


export const httpUserGroupUserAdd = (user_id: string, user_group_id: string) => {
  return http.request<Result>("post", baseUrlApi(`user-group-user/add`), { data: { user_group_id, user_id } });
};

export const httpUserGroupUserDel = (id: string) => {
  return http.request<Result>("delete", baseUrlApi('user-group-user/del'), { params: { id } });
};

export const httpUserGroupByUserId = (user_id: string) => {
  return http.request<Result>("get", baseUrlApi('user-group-user/user-group'), { params: { user_id } });
};
