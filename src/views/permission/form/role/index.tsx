

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
        }}>取消</el-button>
        <el-button loading={loading.value} type="primary" onClick={async () => {
          
          let result;
          try {
            if (!formInline.name || !formInline.description) {
              throw new Error('请正规的填写信息')
            }
            loading.value = true
            if (action == 'ADD') {
              result = await httpRoleAdd(formInline);
            } else {
              result = await httpRoleUpdate(formInline);
            }
            loading.value = false
            if (!result.success) {
              throw new Error(result.message)
            } else {
              callback(null,result)
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