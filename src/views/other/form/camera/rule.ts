import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "摄像头名称为必填项", trigger: "blur" }],
  iccid: [{ required: true, message: "摄像头ICCID为必填项", trigger: "blur" }],
  url: [{  required: true, message: "摄像头地址为必填项", trigger: "blur" }],
});
