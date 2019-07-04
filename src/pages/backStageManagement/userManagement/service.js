import { request } from 'utils'

export function getTree (data) {
  return request({
    url: '/office/treeList',
    method: 'POST',
    data,
  }, 'sys')
}

export function company (data) {
  return request({
    url: '/office/company',
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

export function getUserList (data) {
  return request({
    url: '/userList',
    method: 'POST',
    data,
  }, 'sys')
}
export function getUserDetail (data) {
  return request({
    url: `/getUserById/${data.userId}`,
    method: 'POST',
    data,
  }, 'sys')
}
export function getAddUser (data) {
  return request({
    url: '/user/add',
    method: 'POST',
    data,
  }, 'sys')
}

export function getEditUser (data) {
  return request({
    url: '/user/edit',
    method: 'POST',
    data,
  }, 'sys')
}

export function getUserExport (data) {
  return request({
    url: '',
    method: 'POST',
    data,
  }, '')
}

export function getModifyUser (data) {
  return request({
    url: '/user/edit',
    method: 'POST',
    data,
  }, 'sys')
}
export function getDelUser (data) {
  return request({
    url: `/user/delete/${data.id}`,
    method: 'POST',
    data,
  }, 'sys')
}
export function getBuildList (data) {
  return request({
    url: '/publicParams/projectParams',
    method: 'POST',
    data,
  }, 'sys')
}

export function mediaList (data) {
  return request({
    url: '/publicParams/mediaParams',
    method: 'POST',
    data,
  }, 'sys')
}

export function dictList (data) {
  return request({
    url: '/dict/page',
    method: 'POST',
    data,
  }, 'sys')
}

// export function getProjectList (data) {
//   return request({
//     url: '/publicParams/projectParamsForUser',
//     method: 'POST',
//     data,
//   }, 'sys')
// }

// 修改
export function getUserImport(data) {
  return request({
    url: '/getUser',
    data,
  }, 'sys')
}

export function getProjectList(data) {
  return request({
    url: '/projectList',
    data,
    method: 'POST',
  }, 'sys')
}