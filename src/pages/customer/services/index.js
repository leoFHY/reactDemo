import request from 'utils/request';


// 各渠道来源情况
export function channelList(data) {
  return request({
    url: `/customerStatistics/channelList`,
    method: 'POST',
    data: data,
  })
};

// 用户年龄分布
export function userAge(data) {
  return request({
    url: `/customerStatistics/userAge`,
    method: 'POST',
    data: data,
  })
};

// 用户行为日志
export function userBehaviorLog(data) {
  return request({
    url: `/customerStatistics/userBehaviorLog`,
    method: 'POST',
    data: data,
  })
};

// 用户详情
export function userDetail(data) {
  return request({
    url: `/customerStatistics/userDetail`,
    method: 'POST',
    data: data,
  })
};

// 拥有蓝光房源套数
export function userHouse(data) {
  return request({
    url: `/customerStatistics/userHouse`,
    method: 'POST',
    data: data,
  })
};

// 各身份类型用户数
export function userIdentity(data) {
  return request({
    url: `/customerStatistics/userIdentity`,
    method: 'POST',
    data: data,
  })
};
