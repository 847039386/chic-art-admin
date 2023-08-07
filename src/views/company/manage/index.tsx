import { reactive, ref, watch, h } from "vue";
import moment from "moment";
import { message } from "@/utils/message";
import { httpCompanyAll } from "@/api/company.api";
import { httpAssignCompany, httpCompanyCameras, httpUnAssignCompany } from "@/api/camera.api";
import { onAssignCameraFormClick } from "../form/assign_camera";
import { ElLoading } from "element-plus";

// loading
let dataLoading = ref(false);
export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] ? false : true;
  }
);

// datalist
export let company_list = ref([]);
export let pagination = ref({ current: 1, pageSize: 20, total: 0 });

// 过滤
export const searchForm = reactive({
  name: "",
  state: null,
});


export const columns: TableColumnList = [
  {
    label: "创办人",
    width: 150,
    align: "left",
    cellRenderer: ({ row }) => {
      return row.user_id.name ? row.user_id.name : row.user_id.nickname
    }
  },
  {
    label: "公司名称",
    prop: "name",
    align: "left"
  },
  {
    label: "标签",
    align: "left",
    cellRenderer: ({ row }) => {
      let tag = [];
      if (row.tag_ids.length > 0) {
        row.tag_ids.map((item) => {
          tag.push(<el-tag class="mx-1" size="small">{item.name}</el-tag>)
          return item
        })
        return <div>{tag}</div>
      } else {
        return <el-text class="mx-1" size={'small'} type={'info'}>无</el-text>
      }

    }
  },
  {
    label: "状态",
    width: 100,
    cellRenderer: ({ row }) => {
      let str = '';
      let type = '';
      switch (row.state) {
        case 0:
          type = 'success'
          str = '正常'
          break;
        default:
          type = 'danger'
          str = '封禁'
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
  },
  {
    label: "操作",
    width: 120,
    fixed: "right",
    slot: "operation"
  }
];

export const camera_columns: TableColumnList = [
  {
    label: "状态",
    width: 100,
    cellRenderer: ({ row }) => {
      let str = '';
      let type = '';
      switch (row.state) {
        case 0:
          type = 'primary'
          str = '闲置'
          break;
        case 1:
          type = 'success'
          str = '工作'
          break;
        default:
          type = 'info'
          str = '空闲'
          break;
      }
      return <el-text class="mx-1" type={type}>{str}</el-text>
    }
  },
  {
    label: "编号",
    prop: "no",
    width: 100,
  },
  {
    label: "名称",
    align: "left",
    cellRenderer: ({ row }) => {
      return row.name
    }
  },
  {
    label: "操作",
    width: 120,
    fixed: "right",
    slot: "operation"
  }
];


export const onSearch = async (page?: number, limit?: number) => {
  dataLoading.value = true
  let newData = []
  page = page || 1;
  limit = limit || 20
  let match = { page, limit, censor: 0 }

  if (searchForm.name) {
    match = Object.assign(match, { name: searchForm.name })
  }

  if (typeof searchForm.state != 'undefined' && searchForm.state != null) {
    match = Object.assign(match, { state: searchForm.state })
  }

  try {
    const request = await httpCompanyAll(match)
    if (request.success) {
      newData = request.data.rows;
      pagination = ref({
        current: request.data.currentPage,
        pageSize: request.data.pageSize,
        total: request.data.total
      });
    } else {
      message(`错误：${request.message}`, { type: 'error' });
    }
  } catch (error) {
    message(`错误：${error.message}`, { type: 'error' });
  }

  company_list.value = newData
  dataLoading.value = false
};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch(1, pagination.value.pageSize);
}


export const onPageSizeChange = (value: number) => {
  onSearch(pagination.value.current, value)
}

export const onCurrentChange = (value: number) => {
  onSearch(value, pagination.value.pageSize)
}


export let drawerCompany = ref<boolean>(false)
export let company_camera_list_loading = ref<boolean>(false)
export let current_company = ref()
export let company_camera_list = ref([])


let getCamerasByCompanyId = async (id: string) => {
  try {
    company_camera_list_loading.value = true;
    let request = await httpCompanyCameras(id)
    if (request.success) {
      company_camera_list.value = request.data;
      // current_company.value = row;
      // drawerCompany.value = true;
      console.log(request.data)
    } else {
      throw new Error(request.message)
    }
  } catch (error) {
    throw new Error(error.message)
  } finally {
    company_camera_list_loading.value = false;
  }
}


export const openDrawerCompany = async (row: any) => {
  drawerCompany.value = true;
  try {
    await getCamerasByCompanyId(row._id);
    current_company.value = row;
  } catch (error) {
    drawerCompany.value = false;
    message(`错误：${error.message}`, { type: 'error' });
  }
}

export const closeDrawerCompany = () => {
  drawerCompany.value = false;
  current_company.value = {};
  company_camera_list.value = [];
}

export const assignCameraToCompany = async (row) => {
  onAssignCameraFormClick(row, async (err, results) => {
    if (!err) {
      await getCamerasByCompanyId(current_company.value._id);
    } else {
      message(`错误： ${err.message}`, { type: 'error' });
    }
  });
};


export const unAssignCamera = async (row) => {
  try {
    company_camera_list_loading.value = true;
    let request = await httpUnAssignCompany({ id: row._id })
    if (request.success) {
      message(`成功：分配成功`, { type: 'success' });
      await getCamerasByCompanyId(current_company.value._id);
    } else {
      message(`错误：${request.message}`, { type: 'error' });
    }
  } catch (error) {
    message(`错误：${error.message}`, { type: 'error' });
  } finally {
    company_camera_list_loading.value = false;
  }
};


