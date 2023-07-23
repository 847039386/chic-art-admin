import { reactive, ref, watch,h } from "vue";
import moment from "moment";
import { message } from "@/utils/message";
import { httpCameraAll, httpCameraDel } from "@/api/camera.api";
import { onEditCameraFormClick } from "../form/camera";
// loading
let dataLoading = ref(false);
let delLoading = ref(false);

export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
    delLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] && !newVal[1] ? false : true;
  }
);

// datalist
export let camera_list = ref([]);
export let pagination = ref({ current: 1, pageSize: 20, total: 0 });

// 过滤
export const searchForm = reactive({
  name: "",
  state: null,
  no:null
});


export const columns: TableColumnList = [
  {
    label: "ID",
    prop: "_id",
    width: 230,
  },
  {
    label: "编号",
    prop: "no",
    width: 100,
  },
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
    label: "摄像头",
    prop: "name",
    align: "left",
    width: 200,
  },
  {
    label: "所属公司",
    align: "left",
    cellRenderer: ({ row }) => {
      let type = 'info'
      let company_id = row.company_id
      let company_name = '未分配';
      if (company_id) {
        type=""
        company_name = row.company_id.name
      }
      
      return <el-text class="mx-1" type={type}>{company_name}</el-text>
    }
  },
  {
    label: "创建时间",
    align: "center",
    width: 140,
    formatter: ({ create_time }) => moment(create_time).format('YYYY-MM-DD HH:mm')
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
  if (typeof searchForm.state != 'undefined' && searchForm.state != null && searchForm.state !== "") {
    console.log('进来了')
    match = Object.assign(match, { state: searchForm.state })
  }

  if (typeof searchForm.no != 'undefined' && searchForm.no != null &&  searchForm.no != "") {
    match = Object.assign(match, { no: searchForm.no })
  }
  try {
    const request = await httpCameraAll(match)
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

  camera_list.value = newData
  dataLoading.value = false
};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}

export const handleDelete = async (row) => {
  try {
    delLoading.value = true
    let request = await httpCameraDel(row._id)
    if (request.success) {
      message(`成功：删除摄像头${row.name}`, { type: 'success' })
      onSearch();
    } else {
      message(`错误：${request.message}`,{type:'error'})
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'})
  } finally {
    delLoading.value = false
  }
}


export const editCamera = async (action :string ,row?: any) => {
  row = row || {}
  onEditCameraFormClick(action,row, function ( err ,results) {
      if (!err) {
        onSearch();
        if (action == 'ADD') {
            message(`您添加了一个摄像头，名称为： ${results.data.name}`,{type:'success'});
        } else {
          message(`您修改了一个摄像头，ID为： ${results.data._id}`,{type:'success'});
        }
      } else if(err){
        message(`错误： ${err.message}`,{type:'error'});
      }
  });
}



