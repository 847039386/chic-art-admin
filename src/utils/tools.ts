import Bowser from "bowser";

export const getParseUserAgent = function (data :string) {
  let bowser = Bowser.parse(data)
  let platform_type = bowser.platform.type;
  let os = bowser.os;
}

/**
 * 给tree添加一个disabled属性保证当父级关闭，子集不可更改，在加一个parent_path字段表明他的层级关系,此方法在权限管理中可起到一定的缓解服务器作用
 * @param tree 
 * @returns 
 */
export const addTreeAvailableIsDisabled = (tree: any[] ,parent_available ?:boolean ,str = '') => {
  tree.map((item) => {
    item.parent_path = `${str}${item.name}`
    let available = true
    if (!(typeof parent_available == 'undefined')) {
      available = parent_available == true ? true : false
    }
    item.disabled = !available
    if (item.children && item.children.length) {
      let is_disabled = item.available == false ? false : true 
      const addstr = `${item.parent_path} > `
      addTreeAvailableIsDisabled(item.children, is_disabled,addstr)
    }
  })
  return tree
}

/**
 * 
 * @param ids 
 * @param tree 
 * @returns 
 */
export const addTreeRolePermissionDisabled = (ids: any[], tree: any[], parent_disabled?: boolean) => {
  console.log(ids)
  tree.map((item) => {
    for (let index = 0; index < ids.length; index++) {
      const element = ids[index];
      if (element == item._id) {
        console.log(element,parent_disabled)
        item.disabled = true
      }
    }

    if (!(typeof parent_disabled == 'undefined')) {
      if((typeof item.disabled == 'undefined')){
        item.disabled = parent_disabled
      }
    }

    console.log(item)
    if (item.children && item.children.length) {
      if (typeof item.disabled == 'undefined') {
        item.disabled = false
      }
      addTreeRolePermissionDisabled(ids ,item.children,item.disabled)
    } 

  })
  return tree
}
