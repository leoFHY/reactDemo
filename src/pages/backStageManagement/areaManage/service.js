import { request } from 'utils'

/* 获取区域列表 */
export function getArea (data) {
  return request({
    url: '/area/getArea',
    method: 'POST',
    data,
  }, 'sys')
}
/* 删除区域 */
export function deleteArea (data) {
  return request({
    url: `/area/delete/${data.areaId}`,
    method: 'POST',
    data,
  }, 'sys')
}
/* 添加区域 */
export function addArea (data) {
  return request({
    url: '/area/add',
    method: 'POST',
    data,
  }, 'sys')
}
/* 修改区域 */
export function updateArea (data) {
  return request({
    url: '/area/update',
    method: 'POST',
    data,
  }, 'sys')
}
/* 获取上级区域 */
export function getParentAreas (data) {
  return request({
    url: `/area/findParentAreas/${data.areaId}`,
    method: 'POST',
    data,
  }, 'sys')
}
