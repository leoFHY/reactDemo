import request from 'utils/request'

//省份城市
export function provinceCity(data) {
    return request({
      url: `/projectInformation/provinceCity`,
      method: 'POST',
      data: data,
    })
}

/* 楼盘信息 */

// 查询
export function queryDetail(data) {
    return request({
      url: `/projectInformation/detail`,
      method: 'POST',
      data: data,
    })
  };
  
  // 更新
  export function updateDetail(data) {
    return request({
      url: `/projectInformation/update`,
      method: 'POST',
      data: data,
    })
  };
  // 图片上传
  export function uploadPicture(data) {
    return request({
      url: `/projectInformation/uploadPicture`,
      method: 'POST',
      data: data,
    })
  };

  // 添加 项目标签
  export function addProjectTag(data) {
    return request({
      url: `/projectTag/addProjectTag`,
      method: 'POST',
      data: data,
    })
  };
  
  // 项目标签列表
  export function projectTagList(data) {
    return request({
      url: `/projectTag/projectTagList`,
      method: 'POST',
      data: data,
    })
  };

   // 修改 已选择的项目标签
   export function updateProjectTagRel(data) {
     return request({
       url: `/projectTag/updateProjectTagRel`,
       method: 'POST',
       data: data,
     })
   };