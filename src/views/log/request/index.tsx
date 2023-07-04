import Bowser from "bowser";
import moment from "moment";
import { reactive } from "vue";
import { httpRequestLogAll } from '@/api/request_log.api'
import { addDialog } from "@/components/ReDialog";
export function handleClick(row) {
  console.log(
    "%crow===>>>: ",
    "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
    row
  );
}


export const listResLog = async (page: number, limit: number) => {
  const request = await httpRequestLogAll(page, limit) 
  if (request.data.rows.length > 0) {
    request.data.rows.map((item: any) => {
      let bowser = Bowser.parse(item.platform)
      item.device = bowser.platform.type
      item.system = bowser.os.name
      item.c_time = moment(item.create_time).format('YYYY-MM-DD HH:mm')
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
    label: "请求",
    prop: "request_method",
    align :"center",
    width: 100,
    cellRenderer: ({ row }) => {
      let type = 'info';
      if(row.status_code >= 400)
      {
        type = 'danger'
      } else {
        type = 'success'
      }

      return <div><el-tag class="ml-2" type={ type}>{ row.request_method }</el-tag></div>
    }
  },
  {
    label: "响应码",
    prop: "status_code",
    width: 80,
    align :"center"
  },
  {
    label: "响应时间",
    prop: "response_time",
    width: 120,
    align :"center",
    cellRenderer: ({ row }) => {
      let type = row.response_time > 10 ? 'danger' : 'success'
      return <div><el-tag class="ml-2" type={ type}>{ row.response_time + " ms" }</el-tag></div>
    }
  },
  {
    label: "参数",
    slot: "req_data",
    width: 80,
    align :"center",
  },
  {
    label: "返回值",
    slot: "res_data",
    width: 80,
    align :"center",
  },
  {
    label: "访问时间",
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
  {
    label: "地址",
    prop: "api",
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

