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
  drawerCompany,
  openDrawerCompany,
  company_camera_list,
  closeDrawerCompany,
  camera_columns,
  company_camera_list_loading,
  unAssignCamera,
  current_company,
  setDuration,
  assignCameraToCompany
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Setting from "@iconify-icons/ep/setting";
import Delete from "@iconify-icons/ep/delete";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Timer from "@iconify-icons/ep/timer";

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
      <el-form-item label="状态：" prop="state">
        <el-select
          v-model="searchForm.state"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="正常" :value="0" />
          <el-option label="封禁" :value="1" />
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
      title="公司管理"
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
              :icon="useRenderIcon(Setting)"
              @click="openDrawerCompany(row)"
            >
              管理
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
    <el-drawer
      v-model="drawerCompany"
      direction="rtl"
      size="800"
      :before-close="closeDrawerCompany"
    >
      <template #header>
        <h4>摄像头管理</h4>
      </template>

      <template #default>
        <pure-table
          :data="company_camera_list"
          :columns="camera_columns"
          :border="true"
          row-key="_id"
          showOverflowTooltip
          :loading="company_camera_list_loading"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              type="primary"
              @click="setDuration(row)"
              :icon="useRenderIcon(Timer)"
            >
              续时
            </el-button>
            <el-popconfirm
              :title="`是否取消分配这个摄像头?`"
              @confirm="unAssignCamera(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :icon="useRenderIcon(Delete)"
                >
                  取消分配
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="closeDrawerCompany">关闭</el-button>
          <el-button
            @click="assignCameraToCompany(current_company)"
            type="primary"
            >分配摄像头</el-button
          >
        </div>
      </template>
    </el-drawer>
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
