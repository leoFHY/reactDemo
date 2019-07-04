import { request } from 'utils'

export function list (data) {
  return request({
    url: `/office/list/${data.officeId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function deletes (data) {
  return request({
    url: `/office/delete/${data.officeId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function detail (data) {
  return request({
    url: `/office/detail/${data.officeId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function treeList (data) {
  return request({
    url: '/office/treeList',
    method: 'POST',
    data,
  }, 'sys')
}

export function update (data) {
  return request({
    url: '/office/update',
    method: 'POST',
    data,
  }, 'sys')
}

export function add (data) {
  return request({
    url: '/office/add',
    method: 'POST',
    data,
  }, 'sys')
}

export function treeDataUser (data) {
  return request({
    url: '/office/treeDataUser',
    method: 'POST',
    data,
  }, 'sys')
}

export function getArea (data) {
  return request({
    url: '/area/getArea',
    method: 'POST',
    data,
  }, 'sys')
}