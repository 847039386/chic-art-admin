import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "用户名称", trigger: "blur" }],
  user_id: [{ required: true, message: "用户ID为必填项", trigger: "blur" }],
  user_group_id: [{  required: true, message: "用户组用户ID为必填项", trigger: "blur" }],
});
