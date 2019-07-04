import request from 'utils/request';


// 各渠道新增用户数
export function channelUserAdd(data) {
  return request({
    url: `/dataStatistics/channelUserAdd`,
    method: 'POST',
    data: data,
  })
};

// 7天楼盘浏览量前十
export function projectBrowse(data) {
  return request({
    url: `/dataStatistics/projectBrowse`,
    method: 'POST',
    data: data,
  })
};

// 历史楼盘收藏量前十
export function projectCollect(data) {
  return request({
    url: `/dataStatistics/projectCollect`,
    method: 'POST',
    data: data,
  })
};

// 总用户数,总认筹数,总认购数,总认购金额
export function totalUserFour(data) {
  return request({
    url: `/dataStatistics/totalUserFour`,
    method: 'POST',
    data: data,
  })
};

// 用户新增
export function userAdd(data) {
  return request({
    url: `/dataStatistics/userAdd`,
    method: 'POST',
    data: data,
  })
};




// 用户日活
export function userDailyLife(data) {
  return request({
    url: `/dataStatistics/userDailyLife`,
    method: 'POST',
    data: data,
  })
};

// 意向客户登记分日数据
export function userDailyRegister(data) {
  return request({
    url: `/dataStatistics/userDailyRegister`,
    method: 'POST',
    data: data,
  })
};

// 用户到访分日数据
export function userDailyVisit(data) {
  return request({
    url: `/dataStatistics/userDailyVisit`,
    method: 'POST',
    data: data,
  })
};
// 用户认筹分日数据
export function userDailyRenchou(data) {
  return request({
    url: `/dataStatistics/userDailyRenchou`,
    method: 'POST',
    data: data,
  })
};
// 用户认购分日数据
export function userBuy(data) {
  return request({
    url: `/dataStatistics/userBuy`,
    method: 'POST',
    data: data,
  })
};
// 业主/供应商/蓝光员工/自然客户
export function yezhuGongyingLangguangZiran(data) {
  return request({
    url: `/dataStatistics/yezhuGongyingLangguangZiran`,
    method: 'POST',
    data: data,
  })
};

// 总认购金额
export function totalUserBuy(data) {
  return request({
    url: `/dataStatistics/totalUserBuy`,
    method: 'POST',
    data: data,
  })
};