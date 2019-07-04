import request from 'utils/request';
import url from 'utils/ipAdmin';

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