export default {
  path: "/permission",
  meta: {
    title: "权限管理"
  },
  children: [
    {
      path: "/permission/manage",
      name: "PermissionManage",
      component: () => import("@/views/permission/manage/index.vue"),
      meta: {
        title: "权限管理"
      }
    },
    {
      path: "/permission/role",
      name: "PermissionRole",
      component: () => import("@/views/permission/role/index.vue"),
      meta: {
        title: "角色管理"
      }
    },
    {
      path: "/permission/user_group",
      name: "PermissionUserGroup",
      component: () => import("@/views/permission/user_group/index.vue"),
      meta: {
        title: "用户组管理"
      }
    },
    {
      path: "/permission/tree",
      name: "PermissionTree",
      component: () => import("@/views/permission/tree/index.vue"),
      meta: {
        title: "权限树"
      }
    },
  ]
};