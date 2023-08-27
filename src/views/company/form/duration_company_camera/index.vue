<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./rule";

// 声明 props 类型
export interface FormProps {
  formInline: {
    id: string; //摄像头ID
    expire_time: string;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    expire_time: ""
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline" label-width="100px" :rules="formRules">
    <el-form-item label="公司监控ID" prop="id">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.id"
        disabled
        placeholder="请输入公司监控ID"
      />
    </el-form-item>
    <el-form-item label="续时时长" prop="expire_time">
      <el-date-picker
        v-model="newFormInline.expire_time"
        type="datetime"
        placeholder="请选择续时日期"
      />
    </el-form-item>
  </el-form>
</template>
