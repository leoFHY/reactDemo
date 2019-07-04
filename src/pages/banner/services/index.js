import request from 'utils/request';
import url from 'utils/ipAdmin';

// 列表查询
export function queryList(data) {
  return request({
    url: `/bfBanner/list`,
    method: 'POST',
    data: data,
  })
};

// 获取商品/楼盘/房源列表
export function fetchProjectList(data) {
  return request({
    url: `/bfBanner/fetchProjectList`,
    method: 'POST',
    data: data,
  })
};

// 删除banner
export function deleteBanner(data) {
  return request({
    url: `/bfBanner/deleteBanner`,
    method: 'POST',
    data: data,
  })
};

// 新增或修改
export function addOrUpdateBanner(data) {
  return request({
    url: `/bfBanner/addOrUpdateBanner`,
    method: 'POST',
    data: data,
  })
};