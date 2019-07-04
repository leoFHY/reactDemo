import request from 'utils/request';
import url from 'utils/ipAdmin';


// 列表查询
export function queryList(data) {
  return request({
    url: `/bfChannel/list`,
    method: 'POST',
    data: data,
  })
};

// 新增或者修改channel
export function addOrUpdateChannel(data) {
  return request({
    url: `/bfChannel/addOrUpdateChannel`,
    method: 'POST',
    data: data,
  })
};

// 下拉列表
export function pullList(data) {
  return request({
    url: `/bfChannel/pullList`,
    method: 'POST',
    data: data,
  })
};

// 删除
export function deleteChannel(data) {
  return request({
    url: `/bfChannel/deleteChannel`,
    method: 'POST',
    data: data,
  })
};


