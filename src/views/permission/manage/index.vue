<script setup lang="ts">
import { ref, onMounted } from "vue";
import { listPermission, deletePermissionById } from "./index";
import ElTreeLine from "@/components/ReTreeLine";
import { onAddPermissionFormClick } from "../form/permission/index";
import { message } from "@/utils/message";
import data from "@iconify-icons/ri/fullscreen-fill";
import { string } from "vue-types";

let dataLoading = ref(true);
let permission_list = ref([]);
const getPermissionDatas = async (page: number = 1, limit: number = 20) => {
  try {
    dataLoading.value = false;
    let results = await listPermission();
    permission_list.value = results;
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
  getPermissionDatas();
});

const dataProps = {
  label: "name",
  children: "children"
};

const onClickTreeItem = node => {
  onAddPermissionFormClick(node.data, function (results) {
    getPermissionDatas();
    if (results.success) {
      message(`您添加了一条权限，名称为： ${results.data.name}`, {
        customClass: "el"
      });
    }
  });
};

const onDeletePermissionById = async (id: string, name: string) => {
  console.log(id, string);
  let result = await deletePermissionById(id);
  if (result.success) {
    message(`您删除了一条权限，名称为： ${name}`, {
      customClass: "el"
    });
  } else {
    message(`删除错误： ${name}`, {
      customClass: "el",
      type: "error"
    });
  }
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
              <el-button class="button" @click="onClickTreeItem({ data: {} })"
                >添加主权限</el-button
              >
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
                    ======
                    <span>{{ node.data.available }}</span>
                    <span style="padding-right: 10px">
                      <el-button
                        type="primary"
                        size="small"
                        @click="onClickTreeItem(node)"
                        >向下添加权限</el-button
                      >
                      <el-button
                        type="danger"
                        size="small"
                        @click="
                          onDeletePermissionById(node.data._id, node.data.name)
                        "
                        >删除</el-button
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
