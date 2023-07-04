import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
// export const REGEXP_PWD =
//   /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** 密码正则： 至少包含字母、数字，6-16位 */
export const REGEXP_PWD = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/;

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            // new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
            new Error("密码格式应至少包含字母、数字的6-16位组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules };
