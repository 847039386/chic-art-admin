import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "权限名称为必填项", trigger: "blur" }],
  type: [{ required: true, message: "权限类型为必填项", trigger: "blur" }],
  parent_path: [{ required: true, message: "父权限为必填项", trigger: "blur" }],
  code: [{ required: true, message: "权限码为必填项", trigger: "blur" }],
  description: [{  required: true, message: "权限描述为必填项", trigger: "blur" }],
});

