import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "公司名称为必填项", trigger: "blur" }],
  company_id: [{ required: true, message: "公司ID必填项", trigger: "blur" }],
  camera_id: [{  required: true, message: "摄像头ID为必填项", trigger: "blur" }],
});
