// import buildRequest, { download } from '../utils/buildRequest'
import request from 'utils/request';
import { download } from 'utils'
import url from 'utils/ipAdmin';

//项目名称，楼盘列表
export function productShowcaseList(data) {
  return request({
    url: `/commodity/productShowcaseList`,
    method: 'POST',
    data: data,
  })
}

// 大众经纪人
export function userPageList(data) {
  return request({
    url: `/user/userPage`,
    method: 'POST',
    data: data,
  })
}

// 大众经纪人列表导出
export function userExport(data) {
  return download({
    url: `/user/userExport`,
    data: data,
  })
}

// 推介列表
export function userInvitePage(data) {
  return request({
    url: `/userInvite/userInvitePage`,
    method: 'POST',
    data: data,
  })
}

// 推介列表导出
export function userInviteExport(data) {
  return download({
    url: `/userInvite/userInviteExport`,
    data: data,
  })
}

// 佣金列表
export function userInviteCommissionPage(data) {
  return request({
    url: `/userInviteStatus/userInviteCommissionPage`,
    method: 'POST',
    data: data,
  })
}

// 佣金列表导出
export function userInviteCommissionExport(data) {
  return download({
    url: `/userInviteStatus/userInviteCommissionExport`,
    data: data,
  })
}

// 成交列列表
export function userInviteDealPage(data) {
  return request({
    url: `/userInviteStatus/userInviteDealPage`,
    method: 'POST',
    data: data,
  })
}

// 成交列表导出
export function userInviteDealExport(data) {
  return download({
    url: `/userInviteStatus/userInviteDealExport`,
    data: data,
  })
}



export function importClose(data) {
  return request({
    url: `/userInviteStatus/importClose`,
    method: 'POST',
    data: data,
    formData: true,
  })
}

export function importUnClose(data) {
  return request({
    url: `/userInviteStatus/importUnClose`,
    method: 'POST',
    data: data,
    formData: true,
  })
}