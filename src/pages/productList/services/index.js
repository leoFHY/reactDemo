import request from 'utils/request'
import url from 'utils/ipAdmin'
import api from 'api'
const { searchList } = api
import { download } from 'utils'
// 模拟数据
export function getList (params) {
  return request({
      url: searchList,
      method: 'POST',
      body: JSON.stringify(params),
    })
}

// 创建商品
export function createProduct(data) {
  return request({
    url: `/commodity/add`,
    method: 'POST',
    data: data,
  })
}

// 城市列表
export function cityList(data) {
  return request({
    url: `/commodity/cityList`,
    method: 'POST',
    data: data,
  })
}

// 列表查询
export function queryList(data) {
  return request({
    url: `/commodity/list`,
    method: 'POST',
    data: data,
  })
}

// 商品展示名称列表
export function showProductLists(data) {
  return request({
    url: `/commodity/productShowcaseList`,
    method: 'POST',
    data: data,
  })
}



// 编辑商品
export function updateBfProject(data) {
  return request({
    url: `/commodity/updateBfProject`,
    method: 'POST',
    data: data,
  })
}


// 删除商品
export function deleteBfProject(data) {
  return request({
    url: `/commodity/deleteBfProject`,
    method: 'POST',
    data: data,
  })
}

//批量下架
export function downBfProjectBatch(data) {
  return request({
    url: `/commodity/downBfProjectBatch`,
    method: 'POST',
    data: data,
  })
}

// 上下架
export function upDown(data) {
  return request({
    url: `/commodity/releaseOrObtained`,
    method: 'POST',
    data: data,
  })
}

// 蓝光在线楼盘列表
export function lgBuildingList(data) {
  return request({
    url: `/commodity/lgProjectList`,
    method: 'POST',
    data: data,
  })
}

// 蓝光在线楼盘列表
export function lyProjectName(data) {
  return request({
    url: `/commodity/lyProjectName`,
    method: 'POST',
    data: data,
  })
}

// 同步
export function tongbu(data) {
  return request({
    url: `/commodity/tongbu`,
    method: 'Get',
    data: data,
  })
}

// 展示隐藏
export function updateHouseShowSwitch(data) {
  return request({
    url: `/commodity/updateHouseShowSwitch`,
    method: 'POST',
    data: data,
  })
}

// 导出预约看房记录表
export function exportUserReserveProject(data) {
  return download({
    url: `/exportUserReserveProject`,
    data: data,
  })
}

// 导出已认证员工记录表
export function employeesDetail(data) {
  return download({
    url: `/exportEmployeeIndentity`,
    data: data,
  })
}



