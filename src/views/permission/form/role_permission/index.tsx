import { ref } from "vue";
import { message } from "@/utils/message";
import forms from "./index.vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { ElLoading } from 'element-plus'
import { httpRolePermissionAdd, httpRolePermissionByRoleId } from "@/api/role_permission.api";
import { addTreeRolePermissionDisabled } from "@/utils/tools";

let loading = ref(false)

let permissionTreeOptions = ref([]);





export const onAddRolePermissionFormClick = async (data: any ,callback :Function) => {


  const loadingInstance = ElLoading.service({ text:'权限树加载中'  })
  const results = await httpPermissionAll();
  const resultsRP = await httpRolePermissionByRoleId(data._id)
  loadingInstance.close()
  if (results.success, resultsRP.success) {
    let ids = []
    resultsRP.data.forEach(element => {
      ids.push(element.permission_id)
    });
    let tree = handleTree(results.data, "_id", "parent_id")
    let newTree = addTreeRolePermissionDisabled(ids,tree)
    permissionTreeOptions.value = newTree;
  } else {
    callback({ message: results.message })
    return 
  }
  let formInline :any = {
    role_name:data.name,
    role_id: data._id,
    permission_tree_options:permissionTreeOptions
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
          callback(null)
        }}>取消</el-button>
        <el-button type="primary" loading={loading.value} onClick={async () => {
          try {
            if (!formInline.permission_id) {
              message('权限ID不能为空' ,{ type: 'error' })
            } else {
              loading.value = true;
              let result = await httpRolePermissionAdd(formInline.role_id, formInline.permission_id)
              loading.value = false;
              if (!result.success) {
                message('添加权限错误：'+ result.message ,{ type: 'error' })
              } else {
                callback(null, result)
                closeDialog(options, index)
              }
            }
          } catch (error) {
            callback(error)
          }
          
        }}>确定</el-button>
      </div>
    ),
    closeCallBack: () => {
      callback(null)
    },
  });
}