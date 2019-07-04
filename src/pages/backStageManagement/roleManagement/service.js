import { request } from 'utils'

export function getTree (data) {
  return request({
    url: '/office/treeList',
    method: 'POST',
    data,
  }, 'sys')
}

export function getRoleList (data) {
  return request({
    url: '/role/getRoleList',
    method: 'POST',
    data,
  }, 'sys')
}

export function getRoleDetail (data) {
  return request({
    url: `/role/get/${data.id}`,
    method: 'get',
    data,
  }, 'sys')
}
export function getRoleTree (data) {
  return request({
    url: '/menu/tree',
    method: 'POST',
    data,
  }, 'sys')
}

export function addRoleSubmit (data) {
  return request({
    url: '/role/addOrEdit',
    method: 'POST',
    data,
  }, 'sys')
}

export function uploadRoleSubmit (data) {
  return request({
    url: '/role/edit',
    method: 'POST',
    data,
  }, 'sys')
}
export function delRol (data) {
  return request({
    url: `/role/delete/${data.roleId}`,
    method: 'POST',
    data,
  }, 'sys')
}
export function getUserByRole (data) {
  return request({
    url: '/role/getUserByRole',
    method: 'POST',
    data,
  }, 'sys')
}

export function getUserById (data) {
  return request({
    url: '/userList',
    method: 'POST',
    data,
  }, 'sys')
}
export function addRoleUser (data) {
  return request({
    url: '/role/addRoleUser',
    method: 'POST',
    data,
  }, 'sys')
}