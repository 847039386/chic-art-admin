

import { h, createVNode, ref } from "vue";
import { message } from "@/utils/message";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpPermissionAdd } from "@/api/permission.api";

export interface AddPermissionFormProps {
  formInline: {
    name: string;
    type: string;
    description: string;
    code: string;
    parent_id ?:string
  };
}

let loading = ref(false)


export function onAddPermissionFormClick(data: any ,callback) {

  let formInline;
  if (data._id) {
    formInline = {
        type: 'API',
        parent_id :data._id
      }
  } else {
    formInline = {
        type: 'API',
    }
  }
  addDialog({
    width: "30%",
    title: "添加权限",
    contentRenderer: () => forms,
    props: {
      // 赋默认值
      isParent: data._id ? true : false,
      formInline
    },
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => closeDialog(options, index)}>取消</el-button>
        <el-button loading={loading.value} onClick={async () => {
          loading.value = true
          let result = await httpPermissionAdd(formInline);
          loading.value = false
          if (!result.success) {
            message('添加权限错误：'+ result.message ,{ customClass: 'el', type: 'error' })
          } else {
            callback(result)
            closeDialog(options, index)
          }
        }}>确定</el-button>
      </div>
    )
  });
}