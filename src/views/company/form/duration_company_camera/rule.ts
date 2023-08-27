import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "公司监控ID为必填项", trigger: "blur" }],
  expire_time: [{  required: true, message: "续费时长为必填项", trigger: "blur" }],
});
