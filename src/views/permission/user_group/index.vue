<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  user_group_list,
  handleDelete,
  editUserGroup,
  onSearch,
  searchForm,
  resetForm,
  columns,
  loading,
  addUserGroupRole,
  buttonClass,
  openDrawerSeleteRole,
  closeDrawerSeleteRole,
  drawerRoles,
  rolesColumns,
  user_group_roles,
  user_group_roles_loading,
  ing_selected_user_group,
  handleDeleteRole
} from "./index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Plus from "@iconify-icons/ep/Plus";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import More from "@iconify-icons/ep/more";
import ViewIcon from "@iconify-icons/ep/view";

onMounted(() => {
  onSearch();
});

const tableRef = ref();
const formRef = ref();
</script>

<template>
  <div>
    <el-alert
      title="为了保证用户组的可操作性，用户组父级拥有子集的所有角色，所以当用户组为父级的时候不允许为其添加角色，因为此时的他就像小组队长一样，只需要管理好他的组员就好，因为他组员拥有的角色他同样都拥有"
      type="info"
      show-icon
      :closable="false"
    />
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] mt-2"
    >
      <el-form-item label="用户组名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入用户组名称"
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
          <el-option label="可访问" :value="0" />
          <el-option label="可授权" :value="1" />
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
      title="用户组管理"
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
            @click="editUserGroup('ADD')"
          >
            添加主用户组
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
          element-loading-text="加载中"
          :loading="loading"
          :size="size"
          :data="user_group_list"
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
              :icon="useRenderIcon(Plus)"
              @click="editUserGroup('ADD', row)"
            >
              添加
            </el-button>

            <el-popconfirm
              :title="`是否确认删除用户组名称为${row.name}的这条数据`"
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
            <el-dropdown trigger="click">
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <div v-show="!row.children">
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(ViewIcon)"
                        @click="openDrawerSeleteRole(row)"
                      >
                        查看角色
                      </el-button>
                    </el-dropdown-item>
                  </div>
                  <el-dropdown-item>
                    <el-button
                      :class="buttonClass"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="editUserGroup('UPDATE', row)"
                    >
                      编辑
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <el-drawer
      v-model="drawerRoles"
      direction="rtl"
      :before-close="closeDrawerSeleteRole"
    >
      <template #header>
        <h4>用户组角色</h4>
      </template>

      <template #default>
        <pure-table
          :data="user_group_roles"
          :columns="rolesColumns"
          :border="true"
          row-key="_id"
          showOverflowTooltip
          :loading="user_group_roles_loading"
        >
          <template #operation="{ row }">
            <el-popconfirm
              :title="`是否确认删除 ${row.role_id.name} 这个角色码`"
              @confirm="handleDeleteRole(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="closeDrawerSeleteRole">关闭</el-button>
          <el-button
            @click="addUserGroupRole(ing_selected_user_group)"
            type="primary"
            >添加角色</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style>
.el-drawer__header {
  margin-bottom: 0;
  padding-bottom: 20px;
}
.el-drawer__body {
  background-color: #f0f2f5;
}
</style>
