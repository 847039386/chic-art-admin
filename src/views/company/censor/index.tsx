import { reactive, ref, watch,h } from "vue";
import moment from "moment";
import { ElInput, ElText } from "element-plus";
import { message } from "@/utils/message";
import { isAllEmpty } from "@pureadmin/utils";
import { httpUserAll } from "@/api/user";
import { httpCompanyCensorList, httpCompanyCensorAllow, httpCompanyCensorNotAllow } from "@/api/company.api";

// loading
let dataLoading = ref(false);
let censorLoading = ref(false);

export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
    censorLoading.value
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] && !newVal[1] ? false : true;
  }
);

// datalist
export let company_list = ref([]);

export let pagination = ref({ current: 1, pageSize: 20, total: 0 });

// 过滤
export const searchForm = reactive({
  name: "",
  censor: 1,
});


export const columns: TableColumnList = [
  {
    label: "创办人",
    width: 150,
    align: "left",
    cellRenderer: ({ row }) => {
      return row.user_id.name
    }
  },
  {
    label: "公司名称",
    prop: "name",
    align: "left"
  },
  {
    label: "审核状态",
    width: 100,
    cellRenderer: ({ row }) => {
      let str = '';
      let type = '';
      switch (row.censor) {
        case 0:
          type = 'success'
          str = '审核通过'
          break;
        case 1:
          type = 'warning'
          str = '待审核'
          break;
        default:
          type = 'info'
          str = '拒绝审核'
          break;
      }
      return <el-text class="mx-1" type={type}>{str}</el-text>
    }
  },
  {
    label: "注册时间",
    align: "center",
    width: 140,
    formatter: ({ create_time }) => moment(create_time).format('YYYY-MM-DD HH:mm')
    // cellRenderer: ({ row }) => row.system
  },
  {
    label: "操作",
    width: 160,
    fixed: "right",
    slot: "operation"
  }
];


export const onSearch = async (page?: number, limit?: number) => {
  dataLoading.value = true
  let newData = []
  page = page || 1;
  limit = limit || 20
  let match = { page, limit }
  
  if (searchForm.name) {
    match = Object.assign(match, { name: searchForm.name })
  }

  if (typeof searchForm.censor != 'undefined' && searchForm.censor != null) {
    match = Object.assign(match, { censor: searchForm.censor })
  }

  try {
    const request = await httpCompanyCensorList(match)
    if (request.success) {
      newData = request.data.rows;
      pagination = ref({
        current: request.data.currentPage,
        pageSize: request.data.pageSize,
        total: request.data.total
      });
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  }

  company_list.value = newData
  dataLoading.value = false
};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch(1, pagination.value.pageSize);
}


export function onPageSizeChange(value: number) {
  onSearch(pagination.value.current, value)
}

export function onCurrentChange(value: number) {
  onSearch(value, pagination.value.pageSize)
}


export const companyCensorAllow = async (id: string) => {
  try {
    censorLoading.value = true
    const request = await httpCompanyCensorAllow(id)
    if (request.success) {
      message(`成功：审核通过`, { type: 'success' });
      onSearch(1, pagination.value.pageSize)
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }

  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  } finally {
     censorLoading.value = false
  }
};

export const companyCensorNotAllow = async (id: string) => {
  try {
    censorLoading.value = true
    const request = await httpCompanyCensorNotAllow(id)
    if (request.success) {
      message(`成功：审核拒绝`, { type: 'success' });
      onSearch(1, pagination.value.pageSize)
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  } finally {
     censorLoading.value = false
  }
};


