

import { ref } from "vue";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpCameraAdd ,httpCameraUpdate } from "@/api/camera.api";

export interface AddRoleFormProps {
  formInline: {
    name: string;
    description: string;
  };
}

let loading = ref(false)

export function onEditCameraFormClick(action :string ,data: any ,callback :Function) {

  let formInline;
  let title;
  if (action == 'ADD') {
    title = '创建摄像头'
    formInline = { }
  } else {
    title = '修改摄像头'
    formInline = {
      id :data._id,
      name: data.name,
      iccid: data.iccid,
      url:data.url
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
        <el-button type="primary" loading={loading.value} onClick={async () => {
          
          let result;
          try {
            if (!formInline.name || !formInline.iccid || !formInline.url) {
              throw new Error('请正规的填写信息')
            }
            loading.value = true
            if (action == 'ADD') {
              result = await httpCameraAdd(formInline);
            } else {
              result = await httpCameraUpdate(formInline);
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