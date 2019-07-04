import request from 'utils/request'

// 新增或者编辑楼盘动态
export function addProjectAction(data) {
  return request({
    url: `/projectAction/addProjectAction`,
    method: 'POST',
    data: data,
  })
}

// 删除楼盘动态
export function deleteProjectAction(data) {
  return request({
    url: `/projectAction/deleteProjectAction`,
    method: 'POST',
    data: data,
  })
}

// 项目动态列表分页
export function projectActionPage(data) {
  return request({
    url: `/projectAction/projectActionPage`,
    method: 'POST',
    data: data,
  })
}