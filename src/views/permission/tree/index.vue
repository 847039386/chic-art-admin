<script setup lang="ts">
import { onMounted } from "vue";
import { getPermissionDatas, loading, permission_list } from "./index";
import ElTreeLine from "@/components/ReTreeLine";

onMounted(() => {
  getPermissionDatas();
});

const dataProps = {
  label: "name",
  children: "children"
};
</script>

<template>
  <div v-loading="loading">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="mb-[20px]">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium"> 权限树 </span>
            </div>
          </template>
          <div class="overflow-y-auto max-h-[710px] min-h-[710px]">
            <el-tree
              :indent="30"
              :data="permission_list"
              :props="dataProps"
              :expand-on-click-node="false"
              default-expand-all
              node-key="_id"
              ><template v-slot:default="{ node }">
                <el-tree-line :node="node" :showLabelLine="true"></el-tree-line>
              </template>
            </el-tree>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium"> 角色树 </span>
            </div>
          </template>
          <div class="overflow-y-auto max-h-[710px] min-h-[710px]"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium"> 用户组 </span>
            </div>
          </template>
          <div class="overflow-y-auto max-h-[710px] min-h-[710px]"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.ca_m_t20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
