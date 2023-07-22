export default {
  path: "/other",
  meta: {
    title: "其他管理"
  },
  children: [
    {
      path: "/other/tag",
      name: "OtherTag",
      component: () => import("@/views/other/tag/index.vue"),
      meta: {
        title: "标签管理"
      }
    },
    {
      path: "/other/camera",
      name: "OtherCamera",
      component: () => import("@/views/other/camera/index.vue"),
      meta: {
        title: "摄像头管理"
      }
    }
  ]
};