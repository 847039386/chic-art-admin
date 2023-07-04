<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listPermission } from "./index";
import ElTreeLine from "@/components/ReTreeLine";
import { onClickOutside } from "@vueuse/core";
let dataLoading = ref(true);
let permission_list = ref([]);
const getPermissionDatas = async (page: number = 1, limit: number = 20) => {
  try {
    dataLoading.value = false;
    let results = await listPermission();
    permission_list.value = results;
    dataLoading.value = false;
    console.log(results, "????");
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      dataLoading.value = false;
    }, 500);
  }
};
onMounted(() => {
  getPermissionDatas();
});

const dataProps = {
  label: "name",
  children: "children"
};

const onClickTreeItem = node => {
  console.log(node.data._id);
};
</script>

<template>
  <div v-loading="dataLoading">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="mb-[20px]">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-medium"> 权限树 </span>
              <el-button class="button">添加主权限</el-button>
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
                <el-tree-line :node="node" :showLabelLine="true">
                  <template v-slot:after-node-label>
                    <span style="padding-right: 10px">
                      <el-button size="small" @click="onClickTreeItem(node)"
                        >添加权限</el-button
                      >
                    </span>
                  </template>
                </el-tree-line>
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
