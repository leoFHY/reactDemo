import request from 'utils/request';
import url from 'utils/ipAdmin';

// 关注和浏览
export function collectCountAndScan(data) {
  return request({
    url: `/commodity/collectCountAndScan`,
    method: 'POST',
    data: data,
  })
};

/* 房源信息 */
// 所属楼栋列表
export function toBuildinglist(data) {
  return request({
    url: `/listingInformation/buildinglist`,
    method: 'POST',
    data: data,
  })
};

// 户型列表
export function houseTypeList(data) {
  return request({
    url: `/listingInformation/getListingHouseTypeList`,
    method: 'POST',
    data: data,
  })
};

// 户型列表
export function houseDetil(data) {
  return request({
    url: `/listingInformation/houseDetil`,
    method: 'POST',
    data: data,
  })
};

// 房源信息列表查询
export function queryHouseList(data) {
  return request({
    url: `/listingInformation/list`,
    method: 'POST',
    data: data,
  })
};

// 设定户型
export function houseType(data) {
  return request({
    url: `/listingInformation/setUpHouseType`,
    method: 'POST',
    data: data,
  })
};

/* 操作日志 */

// 操作日志列表查询
export function logList(data) {
  
  return request({
    url: `/bfProjectEditHistory/list`,
    method: 'POST',
    data: data,
  })
};


/* 楼栋信息 */
// 添加销售楼栋
export function addBuilding(data) {
  return request({
    url: `/buildingInformation/addBuilding`,
    method: 'POST',
    data: data,
  })
};

// 查询 添加销售楼栋 列表
export function addBuildingList(data) {
  return request({
    url: `/buildingInformation/addBuildingList`,
    method: 'POST',
    data: data,
  })
};

// 楼栋展示名称列表
export function buildingShowNameList(data) {
  return request({
    url: `/buildingInformation/buildingShowNameList`,
    method: 'POST',
    data: data,
  })
};

// 删除
export function deleteBuilding(data) {
  return request({
    url: `/buildingInformation/delete`,
    method: 'POST',
    data: data,
  })
};

// 楼栋信息列表查询
export function buildingInfoList(data) {
  return request({
    url: `/buildingInformation/list`,
    method: 'POST',
    data: data,
  })
};

// oa楼栋名称列表
export function oaBuildingNameList(data) {
  return request({
    url: `/buildingInformation/oaBuildingNameList`,
    method: 'POST',
    data: data,
  })
};

// 编辑楼栋展示名称
export function updateShowName(data) {
  return request({
    url: `/buildingInformation/updateShowName`,
    method: 'POST',
    data: data,
  })
};




/* 楼盘解读 */

// 查询
export function queryHouse(data) {
  return request({
    url: `/projectInterpretation/query`,
    method: 'POST',
    data: data,
  })
};

// 更新/新增
export function updateHouse(data) {
  return request({
    url: `/projectInterpretation/update`,
    method: 'POST',
    data: data,
  })
};

/* 优惠政策 */
// 查询
export function deleteDiscount(data) {
  return request({
    url: `/discount/deleteDiscount`,
    method: 'POST',
    data: data,
  })
};

// 查询
export function queryDiscount(data) {
  return request({
    url: `/discount/queryDiscount`,
    method: 'POST',
    data: data,
  })
};

// 更新/新增
export function updateDiscount(data) {
  return request({
    url: `/discount/updateDiscount`,
    method: 'POST',
    data: data,
  })
};

// 新增或者修改户型优惠
export function addOrUpdateHouseTypeDiscount(data) {
  return request({
    url: `/houseTypeDiscount/addOrUpdateHouseTypeDiscount`,
    method: 'POST',
    data: data,
  })
};

// 删除户型优惠
export function deleteHouseTypeDiscount(data) {
  return request({
    url: `/houseTypeDiscount/deleteHouseTypeDiscount`,
    method: 'POST',
    data: data,
  })
};

// 户型优惠列表
export function houseTypeDiscountList(data) {
  return request({
    url: `/houseTypeDiscount/houseTypeDiscountList`,
    method: 'POST',
    data: data,
  })
};

// 活动优惠列表
export function queryList(data) {
  return request({
    url: `/specialOffer/specialOfferList`,
    method: 'POST',
    data: data,
  })
};

// 优惠房源列表
export function discountHouse(data) {
  return request({
    url: `/specialOffer/discountHouse`,
    method: 'POST',
    data: data,
  })
};

// 新增/修改优惠活动
export function addOrUpdateSpecialOffer(data) {
  return request({
    url: `/specialOffer/addOrUpdateSpecialOffer`,
    method: 'POST',
    data: data,
  })
};

// 删除优惠信息
export function deleteSpecialOffer(data) {
  return request({
    url: `/specialOffer/deleteSpecialOffer`,
    method: 'POST',
    data: data,
  })
};

// 优惠信息详情
export function specialOfferDetail(data) {
  return request({
    url: `/specialOffer/specialOfferDetail`,
    method: 'POST',
    data: data,
  })
};

// 修改回显
export function updateShowSpecialOffer(data) {
  return request({
    url: `/specialOffer/updateShowSpecialOffer`,
    method: 'POST',
    data: data,
  })
};