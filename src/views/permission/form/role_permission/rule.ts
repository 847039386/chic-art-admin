import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  role_name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  role_id: [{ required: true, message: "角色ID为必填项", trigger: "blur" }],
  permission_id: [{  required: true, message: "权限ID为必填项", trigger: "blur" }],
});
