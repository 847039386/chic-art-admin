import Bowser from "bowser";

export const getParseUserAgent = function (data :string) {
  let bowser = Bowser.parse(data)
  let platform_type = bowser.platform.type;
  let os = bowser.os;
}

/**
 * 给tree添加一个disabled属性保证当父级关闭，子集不可更改，在加一个parent_path字段表明他的层级关系
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
