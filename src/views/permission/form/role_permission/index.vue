<script setup lang="ts">
import { ref, onMounted } from "vue";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { formRules } from "./rule";

// 声明 props 类型
interface FormProps {
  formInline: {
    role_name: string;
    role_id: string;
    permission_id: string;
    permission_tree_options: any[];
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    role_name: "",
    role_id: "",
    permission_id: "",
    permission_tree_options: []
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline" :rules="formRules" label-width="80px">
    <el-form-item label="角色名称" prop="role_name">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.role_name"
        placeholder="名称"
        disabled
      />
    </el-form-item>
    <el-form-item label="角色ID" prop="role_id">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.role_id"
        placeholder="角色id"
        disabled
      />
    </el-form-item>
    <el-form-item label="权限ID" prop="permission_id">
      <el-cascader
        class="!w-[420px]"
        v-model="newFormInline.permission_id"
        :options="newFormInline.permission_tree_options"
        :props="{
          value: '_id',
          label: 'name',
          emitPath: false,
          checkStrictly: true
        }"
        clearable
        filterable
        placeholder="请选择权限"
      >
        <template #default="{ node, data }">
          <span>{{ data.name }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
    </el-form-item>
  </el-form>
</template>
