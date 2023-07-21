<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  company_list,
  onSearch,
  searchForm,
  resetForm,
  columns,
  loading,
  onPageSizeChange,
  onCurrentChange,
  pagination,
  companyCensorAllow,
  companyCensorNotAllow
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EditPen from "@iconify-icons/ep/edit-pen";
import Plus from "@iconify-icons/ep/Plus";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Select from "@iconify-icons/ep/select";
import CloseBold from "@iconify-icons/ep/close-bold";
import { Row } from "element-plus/es/components/table-v2/src/components";

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
      <el-form-item label="公司名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入用户名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="审核状态：" prop="censor">
        <el-select
          v-model="searchForm.censor"
          placeholder="请选择审核状态"
          class="!w-[180px]"
        >
          <el-option label="待审核" :value="1" />
          <el-option label="审核拒绝" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch(1, pagination.pageSize)"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar
      title="公司审核"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
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
          :data="company_list"
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
              :icon="useRenderIcon(Select)"
              @click="companyCensorAllow(row._id)"
            >
              通过
            </el-button>
            <el-button
              v-show="row.censor == 1"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(CloseBold)"
              @click="companyCensorNotAllow(row._id)"
            >
              拒绝
            </el-button>
          </template>
        </pure-table>
        <el-pagination
          class="ca_m_t10"
          v-model:currentPage="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[20, 30, 40]"
          :background="true"
          layout="->,total, sizes, prev, pager, next, jumper"
          @size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
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
