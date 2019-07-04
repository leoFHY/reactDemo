import request from 'utils/request'
import { download } from 'utils'
import url from 'utils/ipAdmin'




// 新增或修改
export function addOrUpdate(data) {
  return request({
    url: `/specialOffer/addOrUpdateSpecialOffer`,
    method: 'POST',
    data: data,
  })
}

// 区域下拉框
export function areaList(data) {
  return request({
    url: `/specialOffer/areaList`,
    method: 'POST',
    data: data,
  })
}

// 删除优惠信息
export function deleteSpecialOffer(data) {
  return request({
    url: `/specialOffer/deleteSpecialOffer`,
    method: 'POST',
    data: data,
  })
}

//优惠房源列表
export function discountHouse(data) {
  return request({
    url: `/specialOffer/discountHouse`,
    method: 'POST',
    data: data,
  })
}

//蓝朋友楼盘-oa楼盘-楼栋-房源列表
export function houseList(data) {
  return request({
    url: `/specialOffer/houseList`,
    method: 'POST',
    data: data,
  })
}


//项目名称列表
export function productShowcaseList(data) {
  return request({
    url: `/commodity/productShowcaseList`,
    method: 'POST',
    data: data,
  })
}


//荷兰拍分页列表
export function helanpaiPage(data) {
  return request({
    url: `/specialOffer/helanpaiPage`,
    method: 'POST',
    data: data,
  })
}


//荷兰拍分页列表
export function upDateHelanpaiStatus(data) {
  return request({
    url: `/specialOffer/upDateHelanpaiStatus`,
    method: 'POST',
    data: data,
  })
}


//优惠详情
export function specialOfferDetail(data) {
  return request({
    url: `/specialOffer/specialOfferDetail`,
    method: 'POST',
    data: data,
  })
}


//未上架荷兰拍列表
export function downHelanpais(data) {
  return request({
    url: `/specialOffer/getDownHelanpais`,
    method: 'POST',
    data: data,
  })
}

//导出
export function helanpaiExport(data) {
  return download({
    url: `/specialOffer/helanpaiExport`,
    method: 'POST',
    data: data,
  })
}

