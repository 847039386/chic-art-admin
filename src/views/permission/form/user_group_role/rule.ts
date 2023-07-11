import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  user_group_name: [{ required: true, message: "用户组名称为必填项", trigger: "blur" }],
  user_group_id: [{ required: true, message: "用户组ID为必填项", trigger: "blur" }],
  role_id: [{  required: true, message: "角色ID为必填项", trigger: "blur" }],
});
