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
export function getCardFaceList(data) {
  return request({
    url: `/cardFace/list`,
    method: 'POST',
    data: data,
  })
}

export function createCardFace(data) {
  return request({
    url: `/cardFace/create`,
    method: 'POST',
    data: data,
  })
}

export function updateCardFace(data) {
  return request({
    url: `/cardFace/update`,
    method: 'POST',
    data: data,
  })
}

export function findCardFace(data) {
  return request({
    url: `/cardFace/findById`,
    method: 'POST',
    data: data,
  })
}

export function deleteCardFace(data) {
  return request({
    url: `/cardFace/delete`,
    method: 'POST',
    data: data,
  })
}