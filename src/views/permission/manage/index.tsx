import Bowser from "bowser";
import moment from "moment";
import { httpPermissionAll } from "@/api/permission.api";

export const listPermission = async () => {
  const request = await httpPermissionAll() 
  return request.data
}



