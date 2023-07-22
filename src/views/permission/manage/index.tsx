import { reactive, ref ,watch } from "vue";
import moment from "moment";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { httpPermissionAll, httpPermissionDel, httpPermissionUpAvailable } from "@/api/permission.api";
import { addTreeAvailableIsDisabled } from "@/utils/tools";
import { onEditPermissionFormClick } from "../form/permission/index";
import { isAllEmpty } from "@pureadmin/utils";
import { handleTree ,treeToList} from "@/utils/tree";
// loading
let dataLoading = ref(false);
let upAvailableLoading = ref(false)
let delPermissionLoading = ref(false)

export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
    upAvailableLoading.value,
    delPermissionLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] && !newVal[1] && !newVal[2] ? false : true;
  }
);


// datalist
export let permission_list = ref([]);

// 过滤
export const searchForm = reactive({
    name: "",
    available: null,
    type:null
});

const switchStyle = {
  "--el-switch-on-color": "#6abe39",
  "--el-switch-off-color": "#e84749"
}

export const columns :TableColumnList = [
    {
      label: "权限名称",
      prop: "name",
      align: "left"
    },
    {
      label: "状态",
      width: 100,
      cellRenderer: scope => {
        return <div>
          <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={upAvailableLoading.value}
          v-model={scope.row.available}
          disabled={scope.row.disabled}
          active-value={true}
          inactive-value={false}
          active-text="已启用"
          style={switchStyle}
          inactive-text={scope.row.disabled == false ? "已停用" :'已关闭'}
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
        </div>
      }
    },
    {
      label: "类型",
      width: 100,
      cellRenderer: ({ row }) => {
        let type_str;
        switch (row.type) {
          case 'API':
            type_str = 'API'
            break;
          case 'MENU':
            type_str = '菜单'
            break;
          case 'BTN':
            type_str = '按钮'
            break;
          default:
            type_str = '其他'
            break;
        }
        return type_str
    }
    },
    {
      label: "权限码",
      prop: "code",
      width: 300,
      align: "left"
    },
    {
      label: "描述",
      prop: "description",
      align: "left"
    },
    {
      label: "创建时间",
      prop: "create_time",
      width: 140,
      formatter: ({ create_time }) => moment(create_time).format('YYYY-MM-DD HH:mm')
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
];

function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.available === false ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        upAvailableLoading.value = true
        let result = await httpPermissionUpAvailable(row._id, row.available)
        let mst = row.available ? '启动' : '停用'
        if (result.success) {
          onSearch()
          message(`${row.name} ${mst}成功，包括他的子集生效 ${result.data.matchedCount} 条`,{type:'success'})
        } else {
          message(`错误：${result.message}`,{type:'error'})
          row.available = !row.available
        }
        upAvailableLoading.value = false
      })
      .catch(() => {
        upAvailableLoading.value = false
        row.available === false ? (row.available = true) : (row.available = false);
      });
}

export const handleDelete = async (row) => {
  let id = row._id
  delPermissionLoading.value = true
  try {
    const result = await httpPermissionDel(id) 
    delPermissionLoading.value = false
    if (result.success) {
      onSearch()
      message(`${row.name} 删除成功，包括他的子集生效 ${result.data.deletedCount} 条`,{type:'success'})
    } else {
      message(`错误：${result.message}`,{type:'error'})
    }
  } catch (error) {
    delPermissionLoading.value = false
    message(`错误：${error.message}`,{type:'error'})
  }
}

export const editPermission = async (action :string ,row?: any) => {
  row = row || {}
  onEditPermissionFormClick(action, row, function (err, results) {
    if (!err) {
        onSearch();
        if (action == 'ADD') {
          message(`您添加了一条权限，名称为： ${results.data.name}`,{type:'success'});
        } else {
          message(`您修改了一条权限，ID为： ${results.data._id}`,{type:'success'});
        }
      } else {
        message(`错误： ${err.message}`,{type:'error'});
      }
  });
}



export const onSearch = async () => {
  dataLoading.value = true;
  let newData = [];
  try {
    const request = await httpPermissionAll()
    if (request.success) {
      newData = treeToList(addTreeAvailableIsDisabled(handleTree(request.data, '_id', 'parent_id')));
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  }
  
  if (!isAllEmpty(searchForm.name)) {
    // 前端搜索权限名称
    newData = newData.filter(item => item.name.includes(searchForm.name));
  }
  if (!isAllEmpty(searchForm.available)) {
    // 前端搜索权限状态
    newData = newData.filter(item => item.available === searchForm.available);
  }
  if (!isAllEmpty(searchForm.type)) {
    // 前端搜索权限类型
    newData = newData.filter(item => item.type === searchForm.type);
  }

  permission_list.value = handleTree(newData, '_id', 'parent_id'); // 处理成树结构
  dataLoading.value = false
};

export const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
}


