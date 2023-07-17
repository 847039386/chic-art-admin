<script setup lang="ts">
import { ref, onMounted } from "vue";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { formRules } from "./rule";

// 声明 props 类型
interface FormProps {
  formInline: {
    name: string;
    user_id: string;
    user_group_id: string;
    user_group_tree_options: any[];
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    user_id: "",
    user_group_id: "",
    user_group_tree_options: []
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline" :rules="formRules" label-width="80px">
    <el-form-item label="用户名" prop="name">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.name"
        placeholder="名称"
        disabled
      />
    </el-form-item>
    <el-form-item label="用户ID" prop="user_id">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.user_id"
        placeholder="角色id"
        disabled
      />
    </el-form-item>
    <el-form-item label="用户组ID" prop="user_group_id">
      <el-cascader
        class="!w-[420px]"
        v-model="newFormInline.user_group_id"
        :options="newFormInline.user_group_tree_options"
        :props="{
          value: '_id',
          label: 'name',
          emitPath: false,
          checkStrictly: true
        }"
        clearable
        filterable
        placeholder="请选择用户组"
      >
        <template #default="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
    </el-form-item>
  </el-form>
</template>
