import request from 'utils/request';
import { download } from 'utils'

// 列表查询
export function getList (data) {
  return request({
    url: `/customerDetail/customerDetailPage`,
    method: 'POST',
    data: data,
  })
}

// 列表查询
export function exportExcel (data) {
  return download({
    url: `/customerDetail/customerDetailExport`,
    data: data,
  })
}