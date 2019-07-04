import { request } from 'utils'


// 获取用户信息
export function getUserImport(data) {
  return request({
    url: `/getUser`,
    data: data,
  }, 'sys')
}

// 获取用户菜单
export function getUserMenu(data) {
  return request({
    url: `/getUserMenu`,
    data: data,
  }, 'sys')
}

