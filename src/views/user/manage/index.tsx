import { reactive, ref, watch } from "vue";
import moment from "moment";
import { ElMessage, ElMessageBox, ElPopconfirm } from "element-plus";
import { message } from "@/utils/message";
import { isAllEmpty } from "@pureadmin/utils";
import { httpUserAll } from "@/api/user";
import { onAddToUserGroupFormClick } from "../form/user_group_user";
import { httpUserGroupUserDel } from "@/api/user_group_user.api";
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
      !newVal[0] && !newVal[1] && !newVal[2] ? false : true;
  }
);

// datalist
export let user_list = ref([]);

export let pagination = ref({ current: 1, pageSize: 20, total: 0 });

// 过滤
export const searchForm = reactive({
  name: "",
  state: null,
});


export const columns: TableColumnList = [
  {
    label: "用户名",
    prop: "name",
    width: 200,
    align: "left"
  },
  {
    label: "状态",
    width: 70,
    cellRenderer: ({ row }) => {
      let type = row.state == 0 ? 'success' : 'danger'
      let str = row.state == 0 ? '正常' : '封禁'
      return <el-text class="mx-1" type={type}>{str}</el-text>
    }
  },
  {
    label: "用户组",
    align: "left",
    cellRenderer: ({ row }) => {
      let group = []; 
      if (row.group.length > 0) {
        row.group.map((item) => {
          let type = item.user_group.available ? '' : 'info'
          group.push(<el-tag class="mx-1" type={type} size="small" onClose={() => {
            ElMessageBox.confirm('是否切断用户与该用户组之间的关联?','警告',{confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning',})
              .then(async () => {
                try {
                  let request = await httpUserGroupUserDel(item._id)
                  if (request.success) {
                    message(`成功：删除了改组与用户之间的关联`,{type:'success'})
                    onSearch(1, pagination.value.pageSize);
                  } else {
                    message(`错误：${request.message}`,{type:'error'})
                  }
                } catch (error) {
                  message(`错误：${error.message}`,{type:'error'})
                }
              })
              .catch(() => {})
          }} closable>{item.user_group.name}</el-tag>)
          return item
        })
        return <div>{group}</div>
      } else {
        return <el-text class="mx-1" size={'small'} type={'info'}>无</el-text>
      }

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
  let match = { page, limit }
  if (searchForm.name) {
    match = Object.assign(match, { name: searchForm.name })
  }

  if (typeof searchForm.state != 'undefined' && searchForm.state != null) {
    match = Object.assign(match, { state: searchForm.state })
  }

  try {
    const request = await httpUserAll(match)
    if (request.success) {
      newData = request.data.rows;
      pagination = ref({
        current: request.data.currentPage,
        pageSize: request.data.pageSize,
        total: request.data.total
      });
      console.log(pagination.value)
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  }

  user_list.value = newData
  dataLoading.value = false
};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch(1, pagination.value.pageSize);
}


export const addToUserGroup = (row) => {
  onAddToUserGroupFormClick(row, (err, result) => {
    if (!err) {
      onSearch(1, pagination.value.pageSize)
      message('添加到用户组成功', { type: 'success' })
    } else {
      message(`错误：${err.message}`, { type: 'error' })
    }
  })
}


export function onPageSizeChange(value: number) {
  onSearch(pagination.value.current, value)
}

export function onCurrentChange(value: number) {
  onSearch(value, pagination.value.pageSize)
}


