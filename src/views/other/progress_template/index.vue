<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  progress_template_list,
  onSearch,
  addProgressTemplate,
  searchForm,
  resetForm,
  columns,
  loading,
  handleDelete,
  updateTagName
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Plus from "@iconify-icons/ep/Plus";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";

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
      <el-form-item label="模板名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入模板名称"
          clearable
          class="!w-[200px]"
        />
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
      title="进度模板管理"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="addProgressTemplate"
        >
          添加进度模板
        </el-button>
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
          element-loading-text="加载中"
          :loading="loading"
          maxHeight="660"
          :size="size"
          :data="progress_template_list"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="updateTagName(row)"
            >
              修改
            </el-button>
            <el-popconfirm :title="`确定删除？`" @confirm="handleDelete(row)">
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

<style>
.ca_m_t10 {
  margin-top: 10px;
}
.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.ca_dialog_duu .el-dialog__body {
  padding: 10px 20px;
}
</style>
