import request from 'utils/request'

// 查询佣金描述
export function selectBfProjectCommission(data) {
  return request({
    url: `/commission/selectBfProjectCommission`,
    method: 'POST',
    data: data,
  })
}

// 新增/修改佣金描述
export function updateBfProjectCommission(data) {
  return request({
    url: `/commission/updateBfProjectCommission`,
    method: 'POST',
    data: data,
  })
}

// 删除佣金描述
export function deleteBfProjectCommission(data) {
  return request({
    url: `/commission/deleteBfProjectCommission`,
    method: 'POST',
    data: data,
  })
}