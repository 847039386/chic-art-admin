import { ref ,watch } from "vue";
import { httpPermissionAll } from "@/api/permission.api";
import { handleTree } from "@/utils/tree";

let permissionLoading = ref(false);
export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    permissionLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value = !newVal[0] ? false : true;
  }
);

export let permission_list = ref([]);

export const getPermissionDatas = async () => {
  try {
    permissionLoading.value = true;
    let results = await httpPermissionAll();
    permission_list.value = handleTree(results.data, "_id", "parent_id");
    permissionLoading.value = false;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      permissionLoading.value = false;
    }, 500);
  }
};
