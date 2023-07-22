import { reactive, ref, watch,h } from "vue";
import moment from "moment";
import { ElInput, ElSpace, ElText } from "element-plus";
import { message } from "@/utils/message";
import { isAllEmpty } from "@pureadmin/utils";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpTagAdd, httpTagAll, httpTagDel, httpTagUpdate } from "@/api/tag.api";
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
export let tag_list = ref([]);

// 过滤
export const searchForm = reactive({
  name: "",
});


export const columns: TableColumnList = [
  {
    label: "ID",
    prop: "_id",
    width: 230,
  },
  {
    label: "标签",
    prop: "name",
    align: "left"
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


export const onSearch = async () => {
  let newData = []
  dataLoading.value = true
  try {
    const request = await httpTagAll()
    if (request.success) {
      newData = request.data;
      
    } else {
      message(`错误：${request.message}`,{type:'error'});
    }

    if (!isAllEmpty(searchForm.name)) {
      newData = newData.filter(item => item.name.includes(searchForm.name));
    }

  } catch (error) {
    message(`错误：${error.message}`,{type:'error'});
  } finally {
    tag_list.value = newData
    dataLoading.value = false
  }

};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}


export const addTag = (row) => {
  let addtag_loading = ref<boolean>(false)
  let tag_name = ref<string>()
  addDialog({
    class:'ca_dialog_duu',
    width: 300,
    title: "创建标签",
    alignCenter: true,
    contentRenderer: () =>
      h(ElSpace, null, () => [
        h('div', null, [
          h(ElText, {type:'danger'}, { default: () => '*' }),
          h(ElText, null, { default: () => '标签名' }),
        ]),
        h(ElInput, {
          modelValue: tag_name.value,
          placeholder: '请输入标签名称',
          onInput: val => {
            tag_name.value = val
          }
        })
      ]),
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button loading={addtag_loading.value} type="primary" onClick={async () => {
            if (tag_name.value) {
              try {
                addtag_loading.value = true
                let request = await httpTagAdd({ name :tag_name.value })
                if (request.success) {
                  closeDialog(options, index)
                  message(`成功：创建标签${tag_name.value}`, { type: 'success' })
                  onSearch();
                } else {
                  message(`错误：${request.message}`,{type:'error'})
                }
              } catch (error) {
                message(`错误：${error.message}`,{type:'error'})
              } finally {
                addtag_loading.value = false
              }
            } else {
              message(`错误：请输入标签名`,{type:'error'})
            }
        }}>确定</el-button>
      </div>
    )
  })
}

export const updateTagName = (row) => {
  let updatetag_loading = ref<boolean>(false)
  let tag_name = ref<string>(row.name)
  addDialog({
    class:'ca_dialog_duu',
    width: 300,
    title: '修改标签',
    alignCenter: true,
    contentRenderer: () =>
      h(ElSpace, null, () => [
        h('div', null, [
          h(ElText, {type:'danger'}, { default: () => '*' }),
          h(ElText, null, { default: () => '标签名' }),
        ]),
        h(ElInput, {
          modelValue: tag_name.value,
          placeholder: '请输入标签名称',
          onInput: val => {
            tag_name.value = val
          }
        })
      ]),
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button loading={updatetag_loading.value} type="primary" onClick={async () => {
            if (tag_name.value) {
              try {
                updatetag_loading.value = true
                let request = await httpTagUpdate({ id:row._id ,name :tag_name.value })
                if (request.success) {
                  closeDialog(options, index)
                  message(`成功：修改标签${row.name}`, { type: 'success' })
                  onSearch();
                } else {
                  message(`错误：${request.message}`,{type:'error'})
                }
              } catch (error) {
                message(`错误：${error.message}`,{type:'error'})
              } finally {
                updatetag_loading.value = false
              }
            } else {
              message(`错误：请输入标签名`,{type:'error'})
            }
        }}>确定</el-button>
      </div>
    )
  })
}


export const handleDelete = async (row) => {
  try {
    delLoading.value = true
    let request = await httpTagDel(row._id)
    if (request.success) {
      message(`成功：删除标签${row.name}`, { type: 'success' })
      onSearch();
    } else {
      message(`错误：${request.message}`,{type:'error'})
    }
  } catch (error) {
    message(`错误：${error.message}`,{type:'error'})
  } finally {
    delLoading.value = false
  }

  console.log(row)
}



