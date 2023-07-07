<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  permission_list,
  handleDelete,
  editPermission,
  onSearch,
  searchForm,
  resetForm,
  columns,
  loading
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Plus from "@iconify-icons/ep/Plus";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";

onMounted(() => {
  onSearch();
});

const tableRef = ref();
const formRef = ref();
</script>

<template>
  <div>
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="权限名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入权限名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="available">
        <el-select
          v-model="searchForm.available"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="启用" :value="true" />
          <el-option label="停用" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select
          v-model="searchForm.type"
          placeholder="请选择类型"
          clearable
          class="!w-[180px]"
        >
          <el-option label="API" value="API" />
          <el-option label="菜单" value="MENU" />
          <el-option label="按钮" value="BTN" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      title="权限管理"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-tooltip placement="top">
          <template #content
            >添加的权限最好是，子级类型与父级类型一致，有利于管理，但并不限制。</template
          >
          <el-button
            type="primary"
            :icon="useRenderIcon(Plus)"
            @click="editPermission('ADD')"
          >
            添加主权限
          </el-button>
        </el-tooltip>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          :border="true"
          adaptive
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          row-key="_id"
          showOverflowTooltip
          table-layout="auto"
          default-expand-all
          :loading="loading"
          :size="size"
          :data="permission_list"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <!-- <template #available="{ row }">
          <el-switch
            class="ml-2"
            inline-prompt
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            active-text="完整展示多个内容"
            inactive-text="多个内容"
          />
        </template> -->
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Plus)"
              @click="editPermission('ADD', row)"
            >
              添加
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="editPermission('UPDATE', row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`是否确认删除权限名称为${row.name}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
