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
      path: "/permission/tree",
      name: "PermissionTree",
      component: () => import("@/views/permission/tree/index.vue"),
      meta: {
        title: "权限树"
      }
    },
  ]
};