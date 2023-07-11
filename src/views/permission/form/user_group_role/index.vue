<script setup lang="ts">
import { ref, onMounted } from "vue";
import { handleTree } from "@/utils/tree";
import { httpPermissionAll } from "@/api/permission.api";
import { formRules } from "./rule";

// 声明 props 类型
interface FormProps {
  formInline: {
    user_group_name: string;
    user_group_id: string;
    role_id: string;
    role_options: any[];
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    user_group_name: "",
    user_group_id: "",
    role_id: "",
    role_options: []
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <el-form :model="newFormInline" :rules="formRules" label-width="80px">
    <el-form-item label="组名称" prop="user_group_name">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.user_group_name"
        placeholder="用户组名称"
        disabled
      />
    </el-form-item>
    <el-form-item label="组ID" prop="user_group_id">
      <el-input
        class="!w-[420px]"
        v-model="newFormInline.user_group_id"
        placeholder="用户组ID"
        disabled
      />
    </el-form-item>
    <el-form-item label="角色ID" prop="role_id">
      <el-select v-model="newFormInline.role_id" placeholder="请选择角色名称">
        <el-option
          v-for="item in newFormInline.role_options"
          :key="item._id"
          :label="item.name"
          :value="item._id"
          :disabled="item.disabled"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
