import { ref ,watch } from "vue";
import { httpPermissionAll } from "@/api/permission.api";
import { handleTree } from "@/utils/tree";
import { httpRoleAll } from "@/api/role.api";
import { httpUserGroupAll } from "@/api/user_group.api";

let permissionLoading = ref(false);
let rolesLoading = ref(false);
let userGroupLoading = ref(false);
export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    permissionLoading.value,
    rolesLoading.value,
    userGroupLoading.value
  ],
  (newVal, oldVal) => {
    loading.value = !newVal[0] && !newVal[1] && !newVal[2] ? false : true;
  }
);

export let permission_list = ref([]);
export let role_list = ref([]);
export let user_group_list = ref([]);

export const getPermissionDatas = async () => {
  try {
    permissionLoading.value = true;
    let results = await httpPermissionAll();
    permission_list.value = handleTree(results.data, "_id", "parent_id");
  } catch (e) {
    console.log(e);
  } finally {
    permissionLoading.value = false;
  }
};

export const getRoleDatas = async () => {
  try {
    rolesLoading.value = true;
    let results = await httpRoleAll();
    role_list.value = handleTree(results.data, "_id", "parent_id");
  } catch (e) {
    console.log(e);
  } finally {
    rolesLoading.value = false;
  }
};

export const getUserGroupDatas = async () => {
  try {
    userGroupLoading.value = true;
    let results = await httpUserGroupAll();
    user_group_list.value = handleTree(results.data, "_id", "parent_id");
  } catch (e) {
    console.log(e);
  } finally {
    userGroupLoading.value = false;
  }
};
