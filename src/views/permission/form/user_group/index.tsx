

import { h, createVNode, ref } from "vue";
import { message } from "@/utils/message";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpUserGroupAdd, httpUserGroupUpdate } from "@/api/user_group.api";

export interface AddUserGroupFormProps {
  formInline: {
    name: string;
    type: string;
    description: string;
    code: string;
    parent_path: string;
    parent_id ?:string
  };
}

let loading = ref(false)

export function onEditUserGroupFormClick(action :string ,data: any ,callback :Function) {

  let formInline;
  let title;
  if (action == 'ADD') {
    if (data._id) {
      title = '添加用户组'
      formInline = {
          type: data.type,
          parent_id: data._id,
          parent_path:data.parent_path,
          available:data.available
        }
    } else {
      title = '添加用户组'
      formInline = {
          type: 0,
      }
    }
  } else {
    title = '修改组'
    formInline = {
      id :data._id,
      type: data.type,
      parent_id: data._id,
      parent_path:data.parent_path,
      available: data.available,
      name: data.name,
      description:data.description
    }
  }

  addDialog({
    width: "30%",
    title,
    contentRenderer: () => forms,
    props: {
      // 赋默认值
      isParent: data._id ? true : false,
      formInline
    },
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button loading={loading.value} type="primary" onClick={async () => {
          try {
            if (!formInline.name || !formInline.description) {
              throw new Error('请正规的填写信息')
            }
            let result;
            loading.value = true
            if (action == 'ADD') {
              result = await httpUserGroupAdd(formInline);
            } else {
              result = await httpUserGroupUpdate(formInline);
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