

import { ref } from "vue";
import forms from "./index.vue";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpAssignCompany, httpCameraAdd ,httpCameraAll,httpCameraUpdate, httpCompanyCameras } from "@/api/camera.api";
import { ElLoading } from "element-plus";

let loading = ref(false)

export const onAssignCameraFormClick = async (data: any ,callback :Function) => {


    let title = '分配摄像头';
    let formInline: any = {}
    const loadingInstance = ElLoading.service({ text: '摄像头加载中' })
    try {
      const request = await httpCameraAll({page :1 ,limit:999 ,state :0 })
      if (request.success) {
        formInline = {
          company_id :data._id,
          name: data.name,
          camera_options :request.data.rows
        }
      } else {
        throw new Error(request.message)
      }
    } catch (error) {
      callback(error)
      return;
    } finally {
      loadingInstance.close()
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
            
            try {
              let result;
              if (!formInline.name || !formInline.company_id || !formInline.camera_id) {
                throw new Error('请正规的填写信息')
              }
              console.log(formInline)
              loading.value = true
              result = await httpAssignCompany({ id :formInline.camera_id , company_id :formInline.company_id});
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