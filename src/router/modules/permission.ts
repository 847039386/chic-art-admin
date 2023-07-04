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
      component: () => import("@/views/permission/manage/index.vue"),
      meta: {
        title: "角色管理"
      }
    },
  ]
};