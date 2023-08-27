

import { ref } from "vue";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpUpdateExpireTime } from "@/api/company_camera.api";


let loading = ref(false)

export const onDurationCompanyCameraFormClick = async (data: any ,callback :Function) => {

  let title = '续时监控';
  let formInline: any = { id : data._id }

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
          
          try {
            let result;
            loading.value = true
            console.log(formInline.id,formInline.expire_time)
            result = await httpUpdateExpireTime(formInline.id,formInline.expire_time);
            if (!result.success) {
              throw new Error(result.message)
            } else {
              callback(null,result)
              closeDialog(options, index)
            }
          } catch (error) {
            callback(error)
          } finally {
            loading.value = false
          }
          
        }}>确定</el-button>
      </div>
    )
  });
}