<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns, listResLog, openJSONDialog } from "./index";
let pagination = ref({ current: 1, pageSize: 20, total: 0 });
let dataLoading = ref(true);
let reqlogs = ref([]);
const getResLogDatas = async (page: number = 1, limit: number = 20) => {
  try {
    dataLoading.value = false;
    let results = await listResLog(page, limit);
    pagination = ref({
      current: results.currentPage,
      pageSize: results.pageSize,
      total: results.total
    });
    reqlogs.value = results.rows;
    dataLoading.value = false;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};
onMounted(() => {
  getResLogDatas();
});

function onPageSizeChange(value: number) {
  getResLogDatas(pagination.value.current, value);
}

function onCurrentChange(value: number) {
  getResLogDatas(value, pagination.value.pageSize);
}
</script>

<template>
  <div v-loading="dataLoading">
    <el-card shadow="never">
      <!-- :style="{ borderTop: '1px solid #ebeef5' }" -->
      <pure-table
        adaptive
        showOverflowTooltip
        row-key="_id"
        table-layout="auto"
        maxHeight="700"
        :data="reqlogs"
        :border="true"
        :columns="columns"
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
    </el-card>
  </div>
</template>

<style>
.ca_m_t20 {
  margin-top: 20px;
}
</style>
