

import { h, createVNode, ref } from "vue";
import { message } from "@/utils/message";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpRoleAdd, httpRoleUpdate } from "@/api/role.api";

export interface AddRoleFormProps {
  formInline: {
    name: string;
    description: string;
  };
}

let loading = ref(false)

export function onEditRoleFormClick(action :string ,data: any ,callback :Function) {

  let formInline;
  let title;
  if (action == 'ADD') {
    title = '添加角色'
    formInline = { }
  } else {
    title = '修改角色'
    formInline = {
      id :data._id,
      name: data.name,
      description:data.description
    }
  }

  addDialog({
    width: "30%",
    title,
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
        <el-button loading={loading.value} onClick={async () => {
          loading.value = true
          let result;
          try {
            if (action == 'ADD') {
              result = await httpRoleAdd(formInline);
            } else {
              result = await httpRoleUpdate(formInline);
            }
          } catch (error) {
            callback(error)
          }
          loading.value = false
          if (!result.success) {
            message('添加角色错误：'+ result.message ,{ type: 'error' })
          } else {
            callback(null,result)
            closeDialog(options, index)
          }
        }}>确定</el-button>
      </div>
    ),
    closeCallBack: () => {
      callback(null)
    },
  });
}