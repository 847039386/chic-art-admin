import Bowser from "bowser";
import moment from "moment";
import { httpPermissionAll, httpPermissionDel } from "@/api/permission.api";

export const listPermission = async () => {
  const request = await httpPermissionAll() 
  return request.data
}

export const deletePermissionById = async (id :string) => {
  const request = await httpPermissionDel(id) 
  return request
}


