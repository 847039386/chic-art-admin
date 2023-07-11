import { ref } from "vue";
import forms from "./index.vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { ElLoading } from 'element-plus'
import { httpRolePermissionAdd, httpRolePermissionByRoleId } from "@/api/role_permission.api";
import { addTreeRolePermissionDisabled } from "@/utils/tools";
import { httpRoleAll } from "@/api/role.api";
import { httpUserGroupRoleAdd, httpUserGroupRoleByUserGroupId } from "@/api/user_group_role.api";

let loading = ref(false)

let roles = ref([]);

export const onAddUserGroupRoleFormClick = async (data: any, callback: Function) => {
  const loadingInstance = ElLoading.service({ text:'角色加载中'  })
  const results = await httpRoleAll()
  loadingInstance.close()
  if (results.success) {
    if (data.roles.length > 0) {
      results.data.map(item => {
      item.disabled = false;
      for (let index = 0; index < data.roles.length; index++) {
        const element = data.roles[index];
        if (element.role_id == item._id) {
          item.disabled = true;
          break;
        }
      }
      return item
    });
    }
    roles.value = results.data;
  } else {
    callback({ message: results.message })
    return 
  }
  let formInline :any = {
    user_group_name: data.name,
    user_group_id: data._id,
    role_options: roles.value
  };

  addDialog({
    width: "30%",
    title: '为用户组添加角色',
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
            console.log(data)
            if (!formInline.user_group_name || !formInline.user_group_id || !formInline.role_id) {
              throw new Error('请正规的填写信息')
            }
            loading.value = true;
            let result = await httpUserGroupRoleAdd(data._id,formInline.role_id)
            loading.value = false;
            if (!result.success) {
              throw new Error(result.message)
            } else {
              callback(null, result)
              closeDialog(options, index)
            }
          } catch (error) {
            callback(error)
          }
        }}>确定</el-button>
      </div>
    )
  });
}