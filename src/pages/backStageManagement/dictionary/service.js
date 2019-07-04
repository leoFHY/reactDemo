import { request } from 'utils'

export function page (data) {
  return request({
    url: '/dict/page',
    method: 'POST',
    data,
  }, 'sys')
}

export function getDictInfo (data) {
  return request({
    url: `/dict/getDictInfo/${data.dictId}`,
    method: 'POST',
    data,
  }, 'sys')
}

export function add (data) {
  return request({
    url: '/dict/add',
    method: 'POST',
    data,
  }, 'sys')
}

export function update (data) {
  return request({
    url: '/dict/update',
    method: 'POST',
    data,
  }, 'sys')
}

export function getType (data) {
  return request({
    url: '/dict/getType',
    method: 'POST',
    data,
  }, 'sys')
}

export function deletes (data) {
  return request({
    url: `/dict/delete/${data.dictId}`,
    method: 'POST',
    data,
  }, 'sys')
}
