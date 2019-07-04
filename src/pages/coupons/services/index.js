// import buildRequest, { download } from '../utils/buildRequest'
import request from 'utils/request';
import { download } from 'utils'
import url from 'utils/ipAdmin';

// 优惠券模板管理

export function add(data) {
  return request({
    url: `/couponDef/add`,
    method: 'POST',
    data: data,
  })
};

export function deleteTem(data) {
  return request({
    url: `/couponDef/delete`,
    method: 'POST',
    data: data,
  })
}

export function detail(data) {
  return request({
    url: `/couponDef/detail`,
    method: 'POST',
    data: data,
  })
}

export function disable(data) {
  return request({
    url: `/couponDef/disable`,
    method: 'POST',
    data: data,
  })
}

export function enable(data) {
  return request({
    url: `/couponDef/enable`,
    method: 'POST',
    data: data,
  })
}

export function listForSelect(data) {
  return request({
    url: `/couponDef/listForSelect`,
    method: 'POST',
    data: data,
  })
}

export function pageList(data) {
  return request({
    url: `/couponDef/pageList`,
    method: 'POST',
    data: data,
  })
}

export function pageListSkuFD(data) {
  return request({
    url: `/couponDef/pageListSkuFD`,
    method: 'POST',
    data: data,
  })
}

export function update(data) {
  return request({
    url: `/couponDef/update`,
    method: 'POST',
    data: data,
  })
}

export function addGoodsList(data) {
  return request({
    url: `/prodSku/list`,
    method: 'POST',
    data: data,
  })
}

export function couponPageListS(data) {
  return request({
    url: `/coupon/pageList`,
    method: 'POST',
    data: data,
  })
}
// 优惠券批次


export function saveBatch(data) {
  return request({
    url: `/couponBatch/save`,
    method: 'POST',
    data: data,
  })
}

export function pageListBatch(data) {
  return request({
    url: `/couponBatch/pageList`,
    method: 'POST',
    data: data,
  })
}

export function makeCouponBatch(data) {
  return request({
    url: `/couponBatch/makeCoupon`,
    method: 'POST',
    data: data,
  })
}

// exports.couponDetailS = (params) => {
//   return request('/coupon/detail', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
export function couponDetailS(data) {
  return request({
    url: `/coupon/detail`,
    method: 'POST',
    data: data,
  })
}
// exports.exportDocS = (params) => {
//   return download('/coupon/export', {
//     method: 'POST',
//     body: JSON.stringify(params),
//     name: '优惠券导出',
//   }, 'coup')
// }
export function exportDocS(data) {
  return request({
    url: `/coupon/export`,
    method: 'POST',
    data: data,
  })
}
// exports.deleteBacth = (params) => {
//   return request('/couponBatch/delete', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
export function deleteBacth(data) {
  return request({
    url: `/couponBatch/delete`,
    method: 'POST',
    data: data,
  })
}
// exports.detailBatch = (params) => {
//   return request('/couponBatch/detail', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
export function detailBatch(data) {
  return request({
    url: `/couponBatch/detail`,
    method: 'POST',
    data: data,
  })
}
// exports.initialNum = (params) => {
//   return request('/coupon/initialNum', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
export function initialNum(data) {
  return request({
    url: `/coupon/initialNum`,
    method: 'POST',
    data: data,
  })
}
// exports.downLoadBatch = (params) => {
//   return download(`/couponBatch/export/${params.id}`, {
//     method: 'GET',
//     name: '优惠券批次导出',
//   }, 'coup')
// }
export function downLoadBatch(data) {
  return download({
    url: `/couponBatch/export/${data.id}`,
    method: 'GET',
    data: data,
  })
}
// exports.couponOrderListS = (params) => {
//   return request('/order/mainOrder', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'order')
// }
export function couponOrderListS(data) {
  return request({
    url: `/order/mainOrder`,
    method: 'POST',
    data: data,
  })
}
export function findByBizType(data) {
  return request({
    url: `/cardFace/findByBizType`,
    method: 'POST',
    data: data,
  })
}
// exports.findByBizType = (params) => {
//   return buildRequest('/cardFace/findByBizType', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
// // 奖品信息
// exports.couponCardList = (params) => {
//   return request('/repertory/repertoryList', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
// exports.downloadDoc = () => {
//   return download('/repertory/repertoryModel', {
//     method: 'POST',
//   }, 'coup')
// }
// // 库存

// exports.couponNumList = (params) => {
//   return request('/repertory/projectRepertoryList', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }

// exports.couponNumEdit = (params) => {
//   return request('/repertory/updateProjectRepertory', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }

// // 模拟
// exports.couponSimulateData = (params) => {
//   return request('/simulator/giftSimulator', {
//     method: 'POST',
//     body: JSON.stringify(params),
//   }, 'coup')
// }
