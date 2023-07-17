import { ref } from "vue";
import forms from "./index.vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { ElLoading } from 'element-plus'
import { httpRolePermissionAdd, httpRolePermissionByRoleId } from "@/api/role_permission.api";
import { addTreeRolePermissionDisabled } from "@/utils/tools";
import { httpUserGroupAll } from "@/api/user_group.api";
import { httpUserGroupByUserId, httpUserGroupUserAdd } from "@/api/user_group_user.api";

let loading = ref(false)

let userGroupTreeOptions = ref([]);

export const onAddToUserGroupFormClick = async (data: any, callback: Function) => {

  const loadingInstance = ElLoading.service({ text: '用户组加载中' })
  const results = await httpUserGroupAll();
  const resultsUG = await httpUserGroupByUserId(data._id)
  loadingInstance.close()
  if (results.success && resultsUG.success) {
    let ids = []
    resultsUG.data.forEach(element => {
      ids.push(element.user_group_id)
    });
    let tree = handleTree(results.data, "_id", "parent_id")
    let newTree = addTreeRolePermissionDisabled(ids, tree)
    userGroupTreeOptions.value = newTree;
  } else {
    callback({ message: results.message })
    return
  }
  let formInline: any = {
    name: data.name,
    user_id: data._id,
    user_group_tree_options: userGroupTreeOptions
  };

  addDialog({
    width: "30%",
    title: '添加权限',
    closeOnClickModal: false,
    contentRenderer: () => forms,
    props: {
      formInline
    },
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button type="primary" loading={loading.value} onClick={async () => {
          try {
            if (!formInline.user_group_id) {
              throw new Error('用户组ID不能为空')
            }
            loading.value = true;
            let result = await httpUserGroupUserAdd(formInline.user_id, formInline.user_group_id)
            loading.value = false;
            if (!result.success) {
              throw new Error(result.message)
            } else {
              callback(null, result)
              closeDialog(options, index)
            }
            console.log(formInline, 'aaaa???')
          } catch (error) {
            callback(error)
          }
        }}>确定</el-button>
      </div>
    )
  });
}