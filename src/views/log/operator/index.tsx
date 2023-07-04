import Bowser from "bowser";
import moment from "moment";
import { reactive } from "vue";
import { addDialog } from "@/components/ReDialog";
import { httpOperatorLogAll } from "@/api/operator_log.api";

export const listOperatorLog = async (page: number, limit: number) => {
  const request = await httpOperatorLogAll(page, limit) 
  if (request.data.rows.length > 0) {
    request.data.rows.map((item: any) => {
      let bowser = Bowser.parse(item.platform)
      item.device = bowser.platform.type
      item.system = bowser.os.name
      item.c_time = moment(item.create_time).format('YYYY-MM-DD/HH:mm')
      return item;
    })
  }
  
  return request.data
}

export const columns: TableColumnList = [
  {
    label: "IP",
    prop: "ip",
    width: 160,
  },
  {
    label: "操作人",
    width: 100,
    cellRenderer: ({ row }) => row.user_id.name
  },
  {
    label: "请求",
    prop: "request_method",
    align :"center",
    width: 100,
    cellRenderer: ({ row }) => {
      let type;
      if(row.error_code == 0 )
      {
        type = 'success'
      } else {
        type = 'danger'
      }
      return <div><el-tag class="ml-2" type={ type}>{ row.request_method }</el-tag></div>
    }
  },
  {
    label: "请求地址",
    prop: "api",
    width: 160,
  },
  {
    label: "类型",
    prop: "type",
    width: 120,
    align :"center",
  },
  {
    label: "模块",
    prop: "module",
    width: 120,
    align :"center",
  },
  {
    label: "主题",
    slot: "subject",
    width: 120,
    align: "center",
    cellRenderer: ({ row }) => {
      if (row.subject) {
        return <el-text type="info">{ row.subject }</el-text>
      } else {
        return <el-text type="info">无</el-text>
      }
    }
  },
  {
    label: "描述",
    prop: "description",
  },
  {
    label: "消息",
    prop: "message",
    cellRenderer: ({ row }) => {
      let type;
      if(row.error_code == 0 )
      {
        type = 'info'
      } else {
        type = 'danger'
      }
      return <el-text class="mx-1" type={type}>{ row.message }</el-text>
    }
  },
  {
    label: "操作时间",
    prop: "c_time",
    align :"center",
    width: 140,
    cellRenderer: ({ row }) => row.c_time
  },
  {
    label: "设备",
    prop: "device",
    align :"center",
    width: 100,
    cellRenderer: ({ row }) => row.device
  },
  {
    label: "操作系统",
    prop: "system",
    align :"center",
    width: 150,
    cellRenderer: ({ row }) => row.system
  },
  // {
  //   label: "操作",
  //   width: "120",
  //   fixed: "right",
  //   slot: "operation"
  // }
];


export const openJSONDialog = function (data) {
  const jsonData = reactive(data);
   addDialog({ 
      title: "JSON详情",
      fullscreenIcon: true,
      hideFooter: true,
      contentRenderer: () => <json-viewer value={jsonData} copyable />
  });
}

