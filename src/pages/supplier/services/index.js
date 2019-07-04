import request from 'utils/request';
import url from 'utils/ipAdmin'


// 列表查询
export function queryList(data) {
  return request({
    url: `/bfSupplier/list`,
    method: 'POST',
    data: data,
  })
};

// 新增或者修改channel
export function addOrUpdateSupplier(data) {
  return request({
    url: `/bfSupplier/addOrUpdateSupplier`,
    method: 'POST',
    data: data,
  })
};

//下拉
export function pullList(data) {
  return request({
    url: `/bfSupplier/pullList`,
    method: 'POST',
    data: data,
  })
};

//删除
export function deleteSupplier(data) {
  return request({
    url: `/bfSupplier/deleteSupplier`,
    method: 'POST',
    data: data,
  })
};