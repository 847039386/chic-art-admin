<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  columns,
  onSearch,
  openJSONDialog,
  onPageSizeChange,
  onCurrentChange,
  pagination,
  reqlogs,
  dataLoading,
  clearedOperatorLog,
  clearedOperatorLogLoading
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";

onMounted(() => {
  onSearch(1, pagination.value.pageSize);
});

const tableRef = ref();
</script>

<template>
  <div>
    <PureTableBar
      title="操作日志"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      @refresh="onSearch(1, pagination.pageSize)"
    >
      <template #buttons>
        <el-popconfirm title="是否操作日志?" @confirm="clearedOperatorLog">
          <template #reference>
            <el-button
              type="danger"
              :loading="clearedOperatorLogLoading"
              :icon="useRenderIcon(Delete)"
            >
              清空日志
            </el-button>
          </template>
        </el-popconfirm>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          adaptive
          showOverflowTooltip
          row-key="_id"
          table-layout="auto"
          maxHeight="700"
          :loading="dataLoading"
          :data="reqlogs"
          :border="true"
          :size="size"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #req_data="{ row }">
            <div v-if="row.request">
              <el-link type="primary" @click="openJSONDialog(row.request)"
                >查看</el-link
              >
            </div>
            <div v-else><el-link type="info" disabled>无参</el-link></div>
          </template>
          <template #res_data="{ row }">
            <div v-if="row.response">
              <el-link type="primary" @click="openJSONDialog(row.response)"
                >查看</el-link
              >
            </div>
            <div v-else><el-link type="info" disabled>无值</el-link></div>
            <!-- <el-button link type="primary" size="small">Edit</el-button> -->
          </template>
        </pure-table>
        <el-pagination
          class="ca_m_t20"
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
.ca_m_t20 {
  margin-top: 20px;
}
</style>
