import { reactive, ref, watch, h } from "vue";
import moment from "moment";
import { ElInput, ElText } from "element-plus";
import { message } from "@/utils/message";
import { isAllEmpty } from "@pureadmin/utils";
import { httpUserAll } from "@/api/user";
import { onAddToUserGroupFormClick } from "../form/user_group_user";
import { httpUserGroupUserDel } from "@/api/user_group_user.api";
import { addDialog, closeDialog } from "@/components/ReDialog";
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
    prop: "nickname",
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
            let ipt = ref<string>();
            let reuu_loading = ref<boolean>(false);
            addDialog({
              class: 'ca_dialog_duu',
              width: 420,
              title: "警告",
              alignCenter: true,
              contentRenderer: () =>
                h('p', null, [
                  h('div', null, [
                    h(ElText, null, { default: () => '是否切断' }),
                    h(ElText, { class: 'mx-1', type: "primary", tag: "b" }, { default: () => row.name }),
                    h(ElText, null, { default: () => '与' }),
                    h(ElText, { class: 'mx-1', type: "primary", tag: "b" }, { default: () => item.user_group.name }),
                    h(ElText, null, { default: () => '之间的关联?' }),
                  ]),
                  h('div', { style: 'margin:10px 0px;' }, [
                    h('span', null, '确认请输入:'),
                    h('i', null, [h(ElText, { tag: "b", type: "danger", style: 'margin:0 10px;' }, { default: () => item._id })]),
                  ]),
                  h(ElInput, {
                    modelValue: ipt.value,
                    placeholder: '请输入码号',
                    onInput: val => {
                      ipt.value = val
                    }
                  })
                ]),
              footerRenderer: ({ options, index }) => (
                <div>
                  <el-button onClick={() => {
                    closeDialog(options, index)
                  }}>取消</el-button>
                  <el-button loading={reuu_loading.value} type="primary" onClick={async () => {
                    if (item._id == ipt.value) {
                      try {
                        reuu_loading.value = true
                        let request = await httpUserGroupUserDel(item._id)
                        if (request.success) {
                          closeDialog(options, index)
                          message(`成功：删除了改组与用户之间的关联`, { type: 'success' })
                          onSearch(1, pagination.value.pageSize);
                        } else {
                          message(`错误：${request.message}`, { type: 'error' })
                        }
                      } catch (error) {
                        message(`错误：${error.message}`, { type: 'error' })
                      } finally {
                        reuu_loading.value = false
                      }
                    } else {
                      message(`错误：输入的验证码错误`, { type: 'error' })
                    }
                  }}>确定</el-button>
                </div>
              )
            })
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
    } else {
      message(`错误：${request.message}`, { type: 'error' });
    }
  } catch (error) {
    message(`错误：${error.message}`, { type: 'error' });
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


