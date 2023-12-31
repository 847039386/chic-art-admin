import { http } from "@/utils/http";
import { baseUrlApi } from "./util"

export type UserResult = {
  success: boolean;
  message: string;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;

  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

type Result = {
  success: boolean;
  data?: any;
  message?: string;
  code?: number
};

// /** 登录 */
// export const getLogin = (data?: object) => {
//   return http.request<UserResult>("post", "/login", { data });
// };

// /** 刷新token */
// export const refreshTokenApi = (data?: object) => {
//   return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
// };


export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("auth/login"), { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", baseUrlApi("auth/refresh-token"), { data });
};

export const httpUserAll = (data?: object) => {
  return http.request<Result>("post", baseUrlApi(`user/list`), { data });
}


