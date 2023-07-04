export default {
  path: "/log",
  meta: {
    title: "日志管理"
  },
  children: [
    {
      path: "/log/request",
      name: "RequestLog",
      component: () => import("@/views/log/request/index.vue"),
      meta: {
        title: "请求日志"
      }
    },
    {
      path: "/log/operator",
      name: "OperatorLog",
      component: () => import("@/views/log/operator/index.vue"),
      meta: {
        title: "操作日志"
      }
    }
  ]
};