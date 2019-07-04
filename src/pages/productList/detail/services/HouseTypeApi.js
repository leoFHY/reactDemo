import request from 'utils/request'

//户型管理添加/修改户型
export function addHouseType(data) {
    return request({
      url: `/houseType/addHouseType`,
      method: 'POST',
      data: data,
    })
}
//户型管理删除户型

export function deleteHouseType(data) {
    return request({
      url: `/houseType/deleteHouseType`,
      method: 'POST',
      data: data,
    })
}


//户型名称下拉框
export function houseTypeNameList(data) {
    return request({
      url: `/houseType/houseTypeNameList`,
      method: 'POST',
      data: data,
    })
}


//户型结构下拉框

export function houseTypeStructureList(data) {
    return request({
      url: `/houseType/houseTypeStructureList`,
      method: 'POST',
      data: data,
    })
}

//列表查询

export function houseTypePageList(data) {
    return request({
      url: `/houseType/page`,
      method: 'POST',
      data: data,
    })
}