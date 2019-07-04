import request from 'utils/request';

// 新增或修改奖品
export function addOrUpdatePrize(data) {
  return request({
    url: `/prize/addOrUpdatePrize`,
    method: 'POST',
    data: data,
  })
};

// 新增或修改抽奖规则
export function addOrUpdateRulePrize(data) {
  return request({
    url: `/prize/addOrUpdateRulePrize`,
    method: 'POST',
    data: data,
  })
};

// 删除奖品
export function deletePrize(data) {
  return request({
    url: `/prize/deletePrize`,
    method: 'POST',
    data: data,
  })
};

// 删除抽奖规则
export function deleteRulePrize(data) {
  return request({
    url: `/prize/deleteRulePrize`,
    method: 'POST',
    data: data,
  })
};

// 修改奖品回显
export function prizeDetail(data) {
  return request({
    url: `/prize/prizeDetail`,
    method: 'POST',
    data: data,
  })
};

// 奖品列表下拉框查询
export function prizeList(data) {
  return request({
    url: `/prize/prizeList`,
    method: 'POST',
    data: data,
  })
};

// 奖品列表分页查询
export function queryList(data) {
  return request({
    url: `/prize/prizeListPage`,
    method: 'POST',
    data: data,
  })
};

// 抽奖规则详情
export function prizeRuleDetail(data) {
  return request({
    url: `/prize/prizeRuleDetail`,
    method: 'POST',
    data: data,
  })
};