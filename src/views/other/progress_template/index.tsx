import { reactive, ref, watch,h, Text } from "vue";
import moment from "moment";
import { ElAlert, ElInput, ElSpace, ElText } from "element-plus";
import { message } from "@/utils/message";
import { isAllEmpty } from "@pureadmin/utils";
import { addDialog ,closeDialog } from "@/components/ReDialog";
import { httpProgressTemplateAdd ,httpProgressTemplateAll ,httpProgressTemplateDel ,httpProgressTemplateUpdate } from "@/api/progress_template.api";
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
export let progress_template_list = ref([]);

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
    label: "模板名称",
    prop: "name",
    width: 200,
    align: "left"
  },
  {
    label: "模板数组",
    align: "left",
    cellRenderer: ({ row }) => {
      let str = row.template.join(' -> ')
      return <el-text class="mx-1" type="primary">{str}</el-text>
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


export const onSearch = async () => {
  let newData = []
  dataLoading.value = true
  try {
    const request = await httpProgressTemplateAll()
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
    progress_template_list.value = newData
    dataLoading.value = false
  }

};

export const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
}


export const addProgressTemplate = () => {
  let progressTemplatePattern = /^[A-Za-z0-9\u4e00-\u9fa5]+(\-[A-Za-z0-9\u4e00-\u9fa5]+)*$/
  let add_progress_template_loading = ref<boolean>(false)
  let progress_name = ref<string>()
  let progress_template = ref<string>()
  let arr_progress_template = ref<any>('解析中')
  addDialog({
    class:'ca_dialog_duu',
    width: 500,
    title: "创建模板",
    alignCenter: true,
    contentRenderer: () =>
      h('div', null, [
        h(ElSpace, { style:'width:100%;' }, () => [
          h('div', null, [
            h(ElText, {type:'danger'}, { default: () => '*' }),
            h(ElText, null, { default: () => '模板名称：' }),
          ]),
          h(ElInput, {
            style:'width:360px;',
            modelValue: progress_name.value,
            placeholder: '请输入模板名称',
            onInput: val => {
              progress_name.value = val
            }
          }),
        ]),
        h(ElSpace, { style :'margin-top:10px;'}, () => [
          h('div', null, [
            h(ElText, {type:'danger'}, { default: () => '*' }),
            h(ElText, null, { default: () => '模板数据：' }),
          ]),
          h(ElInput, {
            style:'width:360px;',
            modelValue: progress_template.value,
            placeholder: '例如：aa-bb-cc',
            onInput: val => {
              progress_template.value = val
              if (progressTemplatePattern.test(progress_template.value)) {
                arr_progress_template.value = val.split('-')
              } else {
                arr_progress_template.value = '解析失败'
              }
            }
          }),
        ]),
        h('div', { style :'margin-top:10px;' }, [
            h(ElAlert, { title:arr_progress_template.value , type:'info' ,closable:false}),
        ]),
      ]),
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button loading={add_progress_template_loading.value} type="primary" onClick={async () => {

          
          let verify = true;
          let msg = ''
          if (!progressTemplatePattern.test(progress_template.value)) {
            verify = false
            msg = '模板应按-分割例如：AA-BB-CC'
          }

          if (!progress_name.value) {
            verify = false
            msg = '模板名称不应为空'
          }

          if (verify) {
            try {
              add_progress_template_loading.value = true
              let progress_template_arr = progress_template.value.split('-')
              let request = await httpProgressTemplateAdd({ name :progress_name.value ,template :progress_template_arr })
              if (request.success) {
                closeDialog(options, index)
                message(`成功：创建模板${progress_name.value}`, { type: 'success' })
                onSearch();
              } else {
                message(`错误：${request.message}`,{type:'error'})
              }
            } catch (error) {
              message(`错误：${error.message}`,{type:'error'})
            } finally {
              add_progress_template_loading.value = false
            }
          } else {
            message(`错误：${msg}`,{type:'error'})
          }
        }}>确定</el-button>
      </div>
    )
  })
}

export const updateTagName = (row) => {
  let id = row._id;
  let oldstr = row.template.join('-') 
  let progressTemplatePattern = /^[A-Za-z0-9\u4e00-\u9fa5]+(\-[A-Za-z0-9\u4e00-\u9fa5]+)*$/
  let add_progress_template_loading = ref<boolean>(false)
  let progress_name = ref<string>(row.name)
  let progress_template = ref<string>(oldstr)
  let arr_progress_template = ref<any>(row.template)
  addDialog({
    class:'ca_dialog_duu',
    width: 500,
    title: "修改模板",
    alignCenter: true,
    contentRenderer: () =>
      h('div', null, [
        h(ElSpace, { style:'width:100%;' }, () => [
          h('div', null, [
            h(ElText, {type:'danger'}, { default: () => '*' }),
            h(ElText, null, { default: () => '模板名称：' }),
          ]),
          h(ElInput, {
            style:'width:360px;',
            modelValue: progress_name.value,
            placeholder: '请输入模板名称',
            onInput: val => {
              progress_name.value = val
            }
          }),
        ]),
        h(ElSpace, { style :'margin-top:10px;'}, () => [
          h('div', null, [
            h(ElText, {type:'danger'}, { default: () => '*' }),
            h(ElText, null, { default: () => '模板数据：' }),
          ]),
          h(ElInput, {
            style:'width:360px;',
            modelValue: progress_template.value,
            placeholder: '例如：aa-bb-cc',
            onInput: val => {
              progress_template.value = val
              if (progressTemplatePattern.test(progress_template.value)) {
                arr_progress_template.value = val.split('-')
              } else {
                arr_progress_template.value = '解析失败'
              }
            }
          }),
        ]),
        h('div', { style :'margin-top:10px;' }, [
            h(ElAlert, { title:arr_progress_template.value , type:'info' ,closable:false}),
        ]),
      ]),
    footerRenderer: ({ options, index }) => (
      <div>
        <el-button onClick={() => {
          closeDialog(options, index)
        }}>取消</el-button>
        <el-button loading={add_progress_template_loading.value} type="primary" onClick={async () => {

          
          let verify = true;
          let msg = ''
          if (!progressTemplatePattern.test(progress_template.value)) {
            verify = false
            msg = '模板应按-分割例如：AA-BB-CC'
          }

          if (!progress_name.value) {
            verify = false
            msg = '模板名称不应为空'
          }

          if (verify) {
            try {
              add_progress_template_loading.value = true
              let progress_template_arr = progress_template.value.split('-')
              let request = await httpProgressTemplateUpdate({ id ,name :progress_name.value ,template :progress_template_arr })
              if (request.success) {
                closeDialog(options, index)
                message(`成功：修改模板${progress_name.value}`, { type: 'success' })
                onSearch();
              } else {
                message(`错误：${request.message}`,{type:'error'})
              }
            } catch (error) {
              message(`错误：${error.message}`,{type:'error'})
            } finally {
              add_progress_template_loading.value = false
            }
          } else {
            message(`错误：${msg}`,{type:'error'})
          }
        }}>确定</el-button>
      </div>
    )
  })
}


export const handleDelete = async (row) => {
  try {
    delLoading.value = true
    let request = await httpProgressTemplateDel(row._id)
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



