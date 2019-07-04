import { request } from 'utils'

export function getUserMsg (data) {
  return request({
    url: `/mem/${data.loginName}`,
    method: 'get',
    data,
  }, 'sys')
}

export function modifyPassword (data) {
  return request({
    url: '/mem/modifyPassword',
    method: 'POST',
    data,
  }, 'sys')
}

export function updateMem (data) {
  return request({
    url: '/mem/updateMem',
    method: 'POST',
    data,
  }, 'sys')
}
