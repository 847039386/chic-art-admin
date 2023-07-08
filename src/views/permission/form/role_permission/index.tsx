import { ref } from "vue";
import { message } from "@/utils/message";
import forms from "./index.vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { ElLoading } from 'element-plus'

let loading = ref(false)

let permissionTreeOptions = ref([]);



const getPermissionAll = async () => {
  // loading.value = true;
  const loadingInstance = ElLoading.service({ text:'权限树加载中'  })
  const results = await httpPermissionAll();
  permissionTreeOptions.value = handleTree(results.data, "_id", "parent_id");
  loadingInstance.close()
  // loading.value = false;
};


export const onAddRolePermissionFormClick = async (data: any ,callback :Function) => {


  const loadingInstance = ElLoading.service({ text:'权限树加载中'  })
  const results = await httpPermissionAll();
  loadingInstance.close()
  if (results.success) {
    permissionTreeOptions.value = handleTree(results.data, "_id", "parent_id");
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
            console.log(formInline)
            // loading.value = true
            // let result = await httpRoleAdd(formInline);
            // loading.value = false
            // if (!result.success) {
            //   message('添加角色错误：'+ result.message ,{ type: 'error' })
            // } else {
            //   callback(null,result)
            //   closeDialog(options, index)
            // }
            if (!formInline.permission_id) {
              message('权限ID不能为空' ,{ type: 'error' })
            } else {
              
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