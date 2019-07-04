import request from 'utils/request';
import url from 'utils/ipAdmin';


// 列表查询
export function queryList(data) {
  return request({
    url: `/bfRecommendProject/list`,
    method: 'POST',
    data: data,
  })
};

// 查询 商品名称列表
export function quertNameList(data) {
  return request({
    url: `/bfRecommendProject/quertNameList`,
    method: 'POST',
    data: data,
  })
};

// 新增或修改
export function update(data) {
  return request({
    url: `/bfRecommendProject/update`,
    method: 'POST',
    data: data,
  })
};

// 新增或修改
export function updateNameList(data) {
  return request({
    url: `/bfRecommendProject/updateNameList`,
    method: 'POST',
    data: data,
  })
};

// 删除
export function deleteRecommend(data) {
  return request({
    url: `/bfRecommendProject/deleteRecommend`,
    method: 'POST',
    data: data,
  })
};