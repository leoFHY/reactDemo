import request from 'utils/request';


// 开关列表
export function switchList(data) {
  return request({
    url: `/switch/switchList`,
    method: 'POST',
    data: data,
  })
};

// 开关编辑
export function updateSwitchStatus(data) {
  return request({
    url: `/switch/updateSwitchStatus`,
    method: 'POST',
    data: data,
  })
};