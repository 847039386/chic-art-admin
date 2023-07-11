<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./rule";

// 声明 props 类型
export interface FormProps {
  formInline: {
    name: string;
    description: string;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ name: "", description: "" })
});

// vue 规定所有的 prop 都遵循着单向绑定原则，直接修改 prop 时，Vue 会抛出警告。此处的写法仅仅是为了消除警告。
// 因为对一个 reactive 对象执行 ref，返回 Ref 对象的 value 值仍为传入的 reactive 对象，
// 即 newFormInline === props.formInline 为 true，所以此处代码的实际效果，仍是直接修改 props.formInline。
// 但该写法仅适用于 props.formInline 是一个对象类型的情况，原始类型需抛出事件
// 推荐阅读：https://cn.vuejs.org/guide/components/props.html#one-way-data-flow
const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline" label-width="80px" :rules="formRules">
    <el-form-item label="名称" prop="name">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.name"
        placeholder="名称"
      />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.description"
        placeholder="请输入描述"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
