import { reactive, ref ,watch } from "vue";
import moment from "moment";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { httpRoleAll, httpRoleDel, httpRoleUpAvailable } from "@/api/role.api";
import { addTreeAvailableIsDisabled } from "@/utils/tools";
import { onEditRoleFormClick } from "../form/role/index";
import { onAddRolePermissionFormClick } from "../form/role_permission";
import { isAllEmpty } from "@pureadmin/utils";
import { handleTree ,treeToList} from "@/utils/tree";
// loading
let dataLoading = ref(false);
let upAvailableLoading = ref(false)
let delRoleLoading = ref(false)
let addRoleLoading = ref(false)

export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
    upAvailableLoading.value,
    delRoleLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] && !newVal[1] && !newVal[2] ? false : true;
  }
);

const switchLoadMap = ref({});

// datalist
export let role_list = ref([]);

// 过滤
export const searchForm = reactive({
    name: "",
    available: null,
});

const switchStyle = {
  "--el-switch-on-color": "#6abe39",
  "--el-switch-off-color": "#e84749"
}

export const columns :TableColumnList = [
    {
      label: "角色名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "状态",
      width: 100,
      cellRenderer: scope => {
        return <div>
          <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
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
        // 这里因为没有子集所以不需要像权限关闭一样，需要重新洗牌数据
        switchLoadMap.value[index] = Object.assign({},switchLoadMap.value[index],{loading: true});
        let result = await httpRoleUpAvailable(row._id, row.available)
        let mst = row.available ? '启动' : '停用'
        if (result.success) {
          message(`${row.name} ${mst}成功`,{type:'success'})
        } else {
          message(`${row.name} ${mst}失败：${result.message}`,{type:'error'})
          row.available = !row.available
        }
        switchLoadMap.value[index] = Object.assign({},switchLoadMap.value[index],{loading: false});
      })
      .catch(() => {
        row.available === false ? (row.available = true) : (row.available = false);
      });
}

export const handleDelete = async (row) => {
  let id = row._id
  delRoleLoading.value = true
  try {
    const result = await httpRoleDel(id) 
    delRoleLoading.value = false
    if (result.success) {
      onSearch()
      message(`${row.name} 角色删除成功`,{type:'success'})
    } else {
      message(`${row.name} 删除失败：${result.message}`,{type:'error'})
    }
  } catch (error) {
    delRoleLoading.value = false
    message(`${row.name} 删除失败：${error.message}`,{type:'error'})
  }
}

export const editRole = async (action :string ,row?: any) => {
  row = row || {}
  onEditRoleFormClick(action,row, function ( err ,results) {
      if (!err && results) {
        onSearch();
        if (results.success) {
          if (action == 'ADD') {
            message(`您添加了一个角色，名称为： ${results.data.name}`,{type:'success'});
          } else {
            message(`您修改了一个角色，ID为： ${results.data._id}`,{type:'success'});
          }
          
        }
      } else if(err){
        message(`错误： ${err.message}`,{type:'error'});
      }
  });
}

export const AddRolePermission = async (row: any) => {
  row = row || {}
  onAddRolePermissionFormClick(row, function ( err ,results) {
      if (!err && results) {
        onSearch();
        if (results.success) {
          message(`您添加了一个角色，名称为： ${results.data.name}`,{type:'success'});
        }
      } else if(err){
        message(`错误： ${err.message}`,{type:'error'});
      }
  });
}



export const onSearch = async () => {
  dataLoading.value = true
  const request = await httpRoleAll() 
  let newData = treeToList(addTreeAvailableIsDisabled(handleTree(request.data, '_id', 'parent_id')));
  
  if (!isAllEmpty(searchForm.name)) {
    // 前端搜索权限名称
    newData = newData.filter(item => item.name.includes(searchForm.name));
  }
  if (!isAllEmpty(searchForm.available)) {
    // 前端搜索权限状态
    newData = newData.filter(item => item.available === searchForm.available);
  }

  role_list.value = handleTree(newData, '_id', 'parent_id'); // 处理成树结构
  dataLoading.value = false
};

export const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
}


