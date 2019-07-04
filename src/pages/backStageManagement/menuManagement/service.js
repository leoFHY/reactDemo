import { request } from 'utils'

export function list (data) {
  return request({
    url: '/menu/tree',
    method: 'POST',
    data,
  }, 'sys')
}

export function add (data) {
  return request({
    url: '/menu/add',
    method: 'POST',
    data,
  }, 'sys')
}

export function deletes (data) {
  return request({
    url: `/menu/delete/${data.menuId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function detail (data) {
  return request({
    url: `/menu/detail/${data.menuId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function updateMenu (data) {
  return request({
    url: '/menu/updateMenu',
    method: 'POST',
    data,
  }, 'sys')
}

export function updateSort (data) {
  return request({
    url: '/menu/updateSort',
    method: 'POST',
    data,
  }, 'sys')
}