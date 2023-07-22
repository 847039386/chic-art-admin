export default {
  path: "/company",
  meta: {
    title: "公司管理"
  },
  children: [
    {
      path: "/company/censor",
      name: "CompanyCensor",
      component: () => import("@/views/company/censor/index.vue"),
      meta: {
        title: "公司审核"
      }
    },
    {
      path: "/company/manage",
      name: "CompanyManage",
      component: () => import("@/views/company/manage/index.vue"),
      meta: {
        title: "公司管理"
      }
    }
  ]
};