import { reactive, ref ,watch ,computed } from "vue";
import moment from "moment";
import { ElLoading, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { httpUserGroupAll, httpUserGroupDel, httpUserGroupUpAvailable } from "@/api/user_group.api";
import { addTreeAvailableIsDisabled } from "@/utils/tools";
import { onEditUserGroupFormClick } from "../form/user_group/index";
import { isAllEmpty } from "@pureadmin/utils";
import { handleTree ,treeToList} from "@/utils/tree";
import { onAddUserGroupRoleFormClick } from "../form/user_group_role";
import { httpUserGroupRoleByUserGroupId, httpUserGroupRoleDel } from "@/api/user_group_role.api";
// loading
let dataLoading = ref(false);
let upAvailableLoading = ref(false)
let delUserGroupLoading = ref(false)

export let loading = ref(false)
// 监听所有loading，当他们都是false的时候主loading才为false
watch(
  () => [
    dataLoading.value,
    upAvailableLoading.value,
    delUserGroupLoading.value,
  ],
  (newVal, oldVal) => {
    loading.value =
      !newVal[0] && !newVal[1] && !newVal[2] ? false : true;
  }
);

export const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
});

// datalist
export let user_group_list = ref([]);

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
      label: "用户组名称",
      prop: "name",
      width: 270,
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
      label: "角色数量",
      width: 100,
      cellRenderer: ({ row }) => {
        if (!row.children) {
          return row.roles.length
        } else {
          return '父级'
        }
      }
    },
    {
      label: "类型",
      width: 100,
      cellRenderer: ({ row }) => {
        let type_str;
        switch (row.type) {
          case 0:
            type_str = '可访问'
            break;
          case 1:
            type_str = '可授权'
            break;
          default:
            type_str = '其他'
            break;
        }
        return type_str
      }
    },
    {
      label: "描述",
      align: "left",
      prop: "description",
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
      width: 200,
      slot: "operation"
    }
];

export const rolesColumns :TableColumnList = [
    
    {
      label: "状态",
      width: 100,
      align:"center",
      cellRenderer: ({ row }) => {
        let type = row.role_id.available ? 'success' : 'danger'
        let str = row.role_id.available ? '启用' : '停用'
        return <el-text class="mx-1" type={type}>{str}</el-text>
      }
    },
    {
      label: "角色名称",
      width: 150,
      cellRenderer: ({ row }) => row.role_id.name
    },
    {
      label: "描述",
      cellRenderer: ({row}) => row.role_id.description
    },
    {
      label: "操作",
      fixed: "right",
      align:"center",
      width: 80,
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
        let result = await httpUserGroupUpAvailable(row._id, row.available)
        let mst = row.available ? '启动' : '停用'
        if (result.success) {
          onSearch()
          message(`${row.name} ${mst}成功，包括他的子集生效 ${result.data.matchedCount} 条`,{type:'success'})
        } else {
          message(`${row.name} ${mst}失败：${result.message}`,{type:'error'})
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
  delUserGroupLoading.value = true
  try {
    const result = await httpUserGroupDel(id) 
    delUserGroupLoading.value = false
    if (result.success) {
      onSearch()
      message(`${row.name} 删除成功，包括他的子集生效 ${result.data.deletedCount} 条`,{type:'success'})
    } else {
      message(`${row.name} 删除失败：${result.message}`,{type:'error'})
    }
  } catch (error) {
    delUserGroupLoading.value = false
    message(`${row.name} 删除失败：${error.message}`,{type:'error'})
  }
}

export const editUserGroup = async (action :string ,row?: any) => {
  row = row || {}
  onEditUserGroupFormClick(action,row, function ( err ,results) {
      if (!err) {
        onSearch();
        if (action == 'ADD') {
            message(`您添加了一个用户组，名称为： ${results.data.name}`,{type:'success'});
        } else {
          message(`您修改了一个用户组，ID为： ${results.data._id}`,{type:'success'});
        }
      } else if(err){
        message(`错误： ${err.message}`,{type:'error'});
      }
  });
}

export const onSearch = async () => {
  dataLoading.value = true
  const request = await httpUserGroupAll() 

  request.data = request.data.map((item) => {
    if (!item.roles || item.roles[0].role.length == 0) {
      item.roles = []
    } else {
      item.roles.map((ipss) => {
        ipss.role = ipss.role[0]
        return ipss
      })
    }
    return item
  })
  
  let newData = treeToList(addTreeAvailableIsDisabled(handleTree(request.data, '_id', 'parent_id')));

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

  user_group_list.value = handleTree(newData, '_id', 'parent_id'); // 处理成树结构

  dataLoading.value = false
};

export const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
}

export const drawerRoles = ref(false)
export const user_group_roles = ref([])
export const user_group_roles_loading = ref(false)
export const ing_selected_user_group = ref()

export const openDrawerSeleteRole = async (row) => {
  let id = row._id
  const loadingInstance = ElLoading.service({ text:'角色列表加载中'  })
  const results = await httpUserGroupRoleByUserGroupId(id);
  if (results && results.success) {
    user_group_roles.value = results.data
    ing_selected_user_group.value = row
    drawerRoles.value = true
  } else {
    message(`加载失败：${results.message}`,{type:'error'})
  }
  loadingInstance.close()
}

export const closeDrawerSeleteRole = () => {
  user_group_roles.value = []
  // ing_selected_user_group.value = {}
  drawerRoles.value = false
}

export const handleDeleteRole = async (row) => {
  try {
    let id = row._id
    user_group_roles_loading.value = true
    const result = await httpUserGroupRoleDel(id) 
    if (result.success) {
      onSearch()
      const roles = await httpUserGroupRoleByUserGroupId(row.user_group_id);
      let newRoles = JSON.parse(JSON.stringify(roles.data))
      if (newRoles.length > 0) {
        newRoles = newRoles.map((item) => {
          item.role = item.role_id,
          item.role_id = item.role._id
          return item
        })
      }
      ing_selected_user_group.value = Object.assign(ing_selected_user_group.value, {
        roles:newRoles
      })
      user_group_roles.value = roles.data
      message(`删除成功`,{type:'success'})
    } else {
      message(`删除失败：${result.message}`,{type:'error'})
    }
    user_group_roles_loading.value = false
  } catch (error) {
    user_group_roles_loading.value = false
    message(`删除失败：${error.message}`,{type:'error'})
  }
}

export const addUserGroupRole = async (row: any) => {
  row = row || {}
  
  onAddUserGroupRoleFormClick(row, async function (err, results) {
      let user_group_id = row._id
      if (!err) {
        onSearch();
        user_group_roles_loading.value = true
        const results = await httpUserGroupRoleByUserGroupId(user_group_id);
        let newRoles = JSON.parse(JSON.stringify(results.data))
        if (newRoles.length > 0) {
          newRoles = newRoles.map((item) => {
            item.role = item.role_id,
            item.role_id = item.role._id
            return item
          })
        }
        ing_selected_user_group.value = Object.assign(ing_selected_user_group.value, {
          roles:newRoles
        })
        user_group_roles.value = results.data
        message(`您为用户组添加了一个角色`, { type: 'success' });
        user_group_roles_loading.value = false
      } else if(err){
        message(`错误： ${err.message}`,{type:'error'});
      }
  });

}

