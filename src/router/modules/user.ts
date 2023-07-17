export default {
  path: "/user",
  meta: {
    title: "用户管理"
  },
  children: [
    {
      path: "/user/manage",
      name: "UserManage",
      component: () => import("@/views/user/manage/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
};