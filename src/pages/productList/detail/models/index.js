/* global window */
import modelExtend from 'dva-model-extend'
import React from 'react'
import { message, Checkbox, Icon } from 'antd'
import { filterModel } from 'utils/model'
import { deepCopy } from 'utils/copy'
import moment from 'moment';
import {
  toBuildinglist,
  queryHouseList,
  houseTypeList,
  houseType,
  logList,
  buildingInfoList,
  buildingShowNameList,
  oaBuildingNameList,
  deleteBuilding,
  updateShowName,
  addBuildingList,
  queryDetail,
  updateDetail,
  updateHouse,
  queryHouse,
  addBuilding,
  houseDetil,
  updateDiscount,
  queryDiscount,
  collectCountAndScan,
  houseTypeDiscountList,
  addOrUpdateHouseTypeDiscount,
  deleteHouseTypeDiscount,
  deleteDiscount
} from '../services/index.js';



export default modelExtend(
  filterModel({ reqFn: buildingInfoList, namespace: 'filterDetail'}),
  {
    namespace: 'filterDetail',
    state: {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      /* 存储图片*/
      mediaImages: [],
      /* 预览图片存储*/
      previewImage: '',
      /* 预览图片是否显示*/
      previewVisible: false,
      deliveryItemId: '',
      ueditorImgs: [],
      initHyperText: '',
      // 房源信息列表数据
      houseList: [],
      // 房源信息列表id
      houseListId: [],
      // 房源信息表头
      columns: [],
      // 选中的列表
      isCheckedList: [],
      // 测试shuju
      testList: [],
      // 存储所属楼栋列表
      buildinglist: [],
      // 存储户型列表
      houseTypeList: [],
      // 操作日志
      logList,
      // bfProjectId
      bfProjectId: '',
      status: '',
      // 楼栋信息列表
      buildingInfoList: [],
      // 楼栋展示名称列表
      showNameList: [],
      // oa楼栋名称列表
      oaBuildingNameList: [],
      // 楼栋信息
      bfBuildingId: '',
      // 楼盘信息
      projectInformation: {},
      // 保存富文本信息
      ueditorInfo: '',
      // 销售楼栋列表
      treeList: [],
      // 销售楼栋显示与否
      visibleCreate: false,
      // 房源详情
      houseDetilList: {},
      detailShow: false,
      // 保存优惠政策富文本信息
      ueditorPreInfo: '',
      ueditorPre: '',
      // 优惠政策查询信息
      preferentialInfo: {
        discountRemarks: '',
        discountTitle: '',
        time: []
      },
      // 关注和浏览
      countAndScan: {},
      // 房源信息竖列勾选
      columnsChecked: {},
      isShowModal: false,
      that: {},
      // 销售楼栋防止点击多次
      createFloorShow: true,
      // 添加楼栋弹出框确定按钮防止点击多次
      createClickShow: true,
      // 户型优惠列表
      houseTypeDiscountList: [],
      // 户型优惠列表分页
      discountPagination: {
        pageCount: 1,
        pageNum: 1,
        pageSize: 10,
      },
      // 户型优惠列表修改分页
      discountPage: 1,
      preContent: '',
      houseTypeId:''
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          // if (location.pathname === '/projectList/detail') {
          //    console.log('xiangqqqqqqqqq');
             
          //    // 请求商品展示名称
          //    dispatch({
          //      type: 'getShowProduct',
          //      payload: {},
          //    });
          // }
        });
      },
    },

    effects: {
      
      // 所属楼栋列表
      * getBuildinglist ({ payload, success }, { put,call }) {
        const ret = yield call(toBuildinglist, payload)
        let { data,code } = ret
        if(code && code === 'S000000'){
          if (!data.length){
             yield put({
               type: 'setHouseList',
               payload: {
                 data: [],
                 columns: [],
               },
             })
          }
          
          yield put({
            type: 'saveBuildinglist',
            payload:{
              data
            }
          })
          
          if (data.length>0) {
            let buildingId = data[0].buildingId
            success(buildingId)
          }
          // yield put({
          //   type: 'getHouseListByBuildingId',
          //   payload: {
          //     bfProjectId: payload.bfProjectId,
          //     buildingId: data[0].buildingId,
          //     that: payload.that,
          //   }
          // })
        } else {
          message.warning(ret.message)
        }
      },
      // 户型列表
      * getHouseType ({ payload, success }, { put,call }) {
        const ret = yield call(houseTypeList, payload)
        let { data,code } = ret
        if (code && code === 'S000000') {
          yield put({
            type: 'savehouseTypeList',
            payload:{
              data
            }
          })
          success()
        } else {
          message.warning(ret.message)
        }
      },
      // 设置户型
      * setType ({ payload, success }, { put,call }) {
        const ret = yield call(houseType, payload.data)
        let { code } = ret
        if(code && code === 'S000000'){
          yield put ({
             type: 'clearColumns',
             payload: {},
          })
         
          success()
          message.success('设置户型成功')
        } else {
          message.warning(ret.message)
        }
      },
     // 根据楼栋查询房间列表信息
    * getHouseListByBuildingId ({payload,success}, { call, put, select }) {
        const ret = yield call(queryHouseList, payload.data)
        const data = ret.data
        // console.log('data```````````````',data);
        if (payload.that) {
            yield put({
              type: 'saveThat',
              payload: {
                data: payload.that
              },
            })
        }
        
       
        const that = payload.that ? payload.that : yield select(state => state.filterDetail.that)
        
        let columnsArray = []
        if (ret.code === 'S000000') {
          yield put({
            type: 'testList',
            payload: {
              data
            },
          })
          let list = []
          let columns = [{
            title: '楼层房号',
            dataIndex: 'floor',
            key: 'floor',
          }]
          if (!data.length) {
            yield put({
              type: 'setHouseList',
              payload: {
                data: [],
                columns: [],
              },
            })
            return
          }
          let columnsList = [...columns]
          let currentFloor = 'currentFloor'
          data.forEach((item) => {
            let key = item.houseNo.substring(item.houseNo.length - 2)
            const houseNoUnitKey = `houseNo${item.unit}${key}`
            if (columnsArray.indexOf(houseNoUnitKey) < 0) {
              columnsArray.push(houseNoUnitKey)
              let columnsItemList = columnsList.filter(v => v.unit === houseNoUnitKey.substr(7, 1))
              if (!columnsItemList.length) {
                columnsList.push({
                  unit: item.unit,
                  title: `${item.unit}单元`,
                  children: [],
                })
              }
              columnsItemList = columnsList.filter(v => v.unit === houseNoUnitKey.substr(7, 1))
              columnsItemList[0].children.push({
                title: (<div><Checkbox onChange={() => that.checkboxList(houseNoUnitKey)} /> {key}</div>),
                key: `${houseNoUnitKey}.id`,
                dataIndex: `${houseNoUnitKey}.houseNo`,
                render: (text, record) => {
                  if (text && record[houseNoUnitKey]) {
                    let houseItem = record[houseNoUnitKey]
                    return (
                      <div style={{ color: '#333',display:'flex',flexDirection:'row' }}>
                        {
                          houseItem && houseItem.houseStatus === '0' ? '' : <Icon type="lock" style={{ fontSize: 18 }} />
                        }
                        <Checkbox style={{padding: '0 2px'}} checked={houseItem && houseItem.checked} onChange={() =>  that.checkboxOnChange(record, houseNoUnitKey)} />
                        <a  style={{ marginLeft: 5 }} tabIndex="-10" onClick={() => that.openDetail(record, houseNoUnitKey)}>
                          {text || ''}
                          {houseItem && houseItem.houseTypeName ? ` (${houseItem.houseTypeName}) ` : null}
                        </a>
                      </div>
                    )
                  }
                  return null
                },
              })
            }
            if (currentFloor !== item.floorNumber) {
              currentFloor = item.floorNumber
              list.push({ floor: item.floorNumber })
            }
            let listItem = list[list.length - 1]
            listItem[houseNoUnitKey] = item
            
            
            // listItem[houseNoUnitKey].houseKey = houseNoUnitKey
            //  listItem[houseNoUnitKey] = item
            listItem[houseNoUnitKey] = Object.assign({houseKey:houseNoUnitKey}, listItem[houseNoUnitKey]);
          })

          yield put({
            type: 'setHouseList',
            payload: {
              data: list,
              columns: columnsList,
            },
          })
        } else {
          message.error(ret.message)
        }
      },
      /*操作日志*/
      // 操作日志列表
      * getLoglist ({ payload }, { put,call }) {
        const ret = yield call(logList, payload.data)
        let { data,code } = ret
        if(code && code === 'S000000'){
          yield put ({
            type: 'saveLoglist',
            payload:{
              data,
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      /*楼栋信息*/
      // 楼栋展示名称列表
      * getBuildingShowNameList ({ payload }, { put,call }) {
        const ret = yield call(buildingShowNameList, payload)
        let { data,code } = ret
        if(code && code === 'S000000'){
            yield put ({
              type: 'saveShowNameList',
              payload: {
                data
              },
            })
        } else {
          message.warning(ret.message)
        }
      },
      // oa楼栋名称列表
      * getOaBuildingNameList ({ payload }, { put,call }) {
        const ret = yield call(oaBuildingNameList, payload)
        let { data,code } = ret
        if(code && code === 'S000000'){
            yield put ({
              type: 'saveOaBuildingNameList',
              payload: {
                data
              },
            })
        } else {
          message.warning(ret.message)
        }
      },
      // oa楼栋名称列表
      * goDel({ payload }, { put, call, select }) {
        const ret = yield call(deleteBuilding, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        
        const changePage = yield select(state => state.filterDetail.changePage)        
        let { data, code } = ret
        if (code && code === 'S000000') {
          yield put({
            type: 'getPageList',
            payload: {
              bfProjectId,
              pageNum: changePage
            },
          })
          message.success('删除成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 编辑楼栋展示名称
      * editShowName({ payload, success }, { put, call, select }) {
        const ret = yield call(updateShowName, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        const changePage = yield select(state => state.filterDetail.changePage)
        let { code } = ret
        if (code && code === 'S000000') {
          success()
          yield put({
            type: 'getPageList',
            payload: {
              bfProjectId,
              pageNum: changePage
            },
          })
          message.success('编辑成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 查询 添加销售楼栋 列表
      * searchAddBuildingList({ payload, success }, { put, call }) {
        const ret = yield call(addBuildingList, payload)
        let { code, data } = ret
        if (code && code === 'S000000') {
          const dataList = []
          const generateList = (data) => {
              let children = []
              for (let i = 0; i < data.length; i += 1) {
                  const node = data[i]
                  const name = node.name
                    children.push({
                      key: node.id,
                      title: name,
                    })
                    if (node.list) {
                      children[i].children = generateList(node.list)
                    }

              }
              return children
          }
          // generateList(data)
          data.forEach((v,i) => {
             dataList.push({
               key: v.id,
               title: v.name,
               disable: '0',
               children: generateList(v.list)
             })
          })
          
          yield put ({
            type: 'saveTreeList',
            payload:{
              data: dataList,

            }
          })
          success && success()
        } else {
          yield put({
            type: 'setFloorShow',
            payload: true
          })
          message.warning(ret.message)
        }
      },

      //楼盘信息
      // // 楼盘信息查询
      // * searchProjectInfo({ payload, success }, { put, call }) {
      //   const ret = yield call(queryDetail, payload)
      //   let { code, data } = ret
      //   if (code && code === 'S000000') {
      //     if(data.buildPic){
      //        let fileList = [];
      //        fileList[0] = {}
      //        fileList[0].uid = 1
      //        fileList[0].status = 'done'
      //        fileList[0].url = data.buildPic
      //        data.fileList = fileList
      //     } else {
      //        data.fileList = []
      //     }

      //      yield put ({
      //        type: 'saveProjectInformation',
      //        payload:{
      //          data
      //        }
      //      })
      //   } else {
      //     message.warning(ret.message)
      //   }
      // },
      // // 楼盘更新
      // * pjInfoUpdate({ payload, success }, { put, call }) {
      //   const ret = yield call(updateDetail, payload)
      //   let { code, data } = ret
      //   if (code && code === 'S000000') {
      //      message.success('保存成功')
      //   } else {
      //     message.warning(ret.message)
      //   }
      // },


      // 富文本更新
      * submitUeditorInfo({ payload, success }, { put, call }) {
        const ret = yield call(updateHouse, payload)
        let { code } = ret
        if (code && code === 'S000000') {
           message.success('保存成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 富文本信息查询
      * getUeditorInfo({ payload, success }, { put, call }) {
        const ret = yield call(queryHouse, payload)
        let { code,data } = ret
        if (code && code === 'S000000') {
           yield put ({
             type: 'ueditorInfoSave',
             payload:{
               data
             }
           })
        } else {
          message.warning(ret.message)
        }
      },
       // 查询优惠政策
      * getUeditorPreInfo ({ payload }, { put, call }) {        
        const ret = yield call(queryDiscount, payload)
        let { code, data} = ret
        if (code && code === 'S000000') {
          let list = deepCopy(data)
          if (data.startDate){
             list.time = [moment(data.startDate), moment(data.endDate)]
          } else {
             list.time = []
          }
          yield put ({
            type: 'ueditorPreInfoSave',
            payload: {
              data: list
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 添加销售楼栋
      * submitFloor({ payload, success }, { put, call , select }) {
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        const ret = yield call(addBuilding, payload)
        let { code } = ret
        if (code && code === 'S000000') {
           message.success('提交成功')
           success()
           yield put({
             type: 'getPageList',
             payload: {
                bfProjectId
             }
           })
        } else {
          message.warning(ret.message)
        }
      },
      // 添加销售楼栋
      * getHouseDetil ({ payload, success }, { put, call }) {
        const ret = yield call(houseDetil, payload)
        let { code,data } = ret
        if (code && code === 'S000000') {
            yield put ({
              type: 'saveHouseDetil',
              payload: {
                 data
              }
            })
            success()
        } else {
          message.warning(ret.message)
        }
      },
      // 提交优惠政策
      * preInfoUpdate ({ payload }, { put, call }) {        
        const ret = yield call(updateDiscount, payload)
        let { code } = ret
        if (code && code === 'S000000') {
            message.success('保存成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 删除优惠政策
      * preInfoDel ({ payload }, { put, call }) {        
        const ret = yield call(deleteDiscount, payload)
        let { code } = ret
        if (code && code === 'S000000') {
            message.success('删除成功')
            yield put ({
              type: 'getUeditorPreInfo',
              payload,
            })
         
            yield put({
              type: 'savePreContent',
              payload: ''
            })
        } else {
          message.warning(ret.message)
        }
      },
      // 关注和浏览
      * followBrowse ({ payload }, { put, call }) {        
        const ret = yield call(collectCountAndScan, payload)
        let { code, data} = ret
        if (code && code === 'S000000') {
          yield put ({
            type: 'saveCountAndScan',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },

      // 户型优惠列表
      * houseTypeDiscountList ({ payload }, { put, call }) {        
        const ret = yield call(houseTypeDiscountList, payload)
        let { code, data} = ret
        if (code && code === 'S000000') {
          let list = []
          let discountList = data.list
          let rowSpan = 0
          discountList.forEach(element => {
             let len = element.list.length
              if (len > 0) {
                element.list.forEach((item, i) => {
                  i == 0 ? rowSpan = len : rowSpan = 0
                  list.push({
                    houseTypeId: element.houseTypeId,
                    houseTypeName: element.houseTypeName,
                    bfProjectId: item.bfProjectId,
                    discountName: item.discountName,
                    discountNum: item.discountNum,
                    discountType: item.discountType,
                    id: item.id,
                    payType: item.payType,
                    rowSpan,
                  })
                })
              } else {
                  list.push({
                    houseTypeId : element.houseTypeId,
                    houseTypeName: element.houseTypeName
                  })
              }
          });
          yield put ({
            type: 'saveHouseTypeDiscountList',
            payload: {
              data : {
                list,
                pagination: {
                  pageCount: data.pageCount,
                  pageNum: data.pageNum,
                  pageSize: list.length,
                  total: data.total,
                }
              },
            },
          })
        } else {
          message.warning(ret.message)
        }
      },

      // 新增或者修改户型优惠
      * editDiscount ({ payload, success }, {  call,select }) {        
        const ret = yield call(addOrUpdateHouseTypeDiscount, payload)
        const discountPage = yield select(state => state.filterDetail.discountPage)
        let { code } = ret
        if (code && code === 'S000000') {
          success()
          message.success('编辑成功')
          
        } else {
          message.warning(ret.message)
        }
      },

       // 删除户型优惠
      * delDiscount ({ payload, success }, { call }) {        
        const ret = yield call(deleteHouseTypeDiscount, payload)
        let { code } = ret
        if (code && code === 'S000000') {
          message.success('删除成功')
          success()
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      saveData(state, { payload }) {
        return {
          ...state,
        };
      },
      onPreview (state,{ payload }){
      return { ...state, ...payload }
      },
      onCancel (state,{ payload }){
        return { ...state,...payload,
        }
      },
      saveMediaImages (state, {payload}) {
        return {
          ...state,
          mediaImages: state.mediaImages.concat(payload.images),
        }
      },
      removeDetailImg (state,{}){
        return {
          ...state,
          mediaImages: [],
        }
      },
      // 存储富文本图片
      saveUeditorImgs (state, { payload }) {
        return {
          ...state,
          ueditorImgs: payload,
        }
      },
      saveUeditor (state, { payload }) {
        return {
          ...state,
          ueditor: payload,
        }
      },

      // 房间列表信息
      setHouseList (state, { payload }) {
        return {
          ...state,
          houseList: [
            ...payload.data,
          ],
          columns: payload.columns,
          // columnsChecked: {},
          // isCheckedList: [],
        }
      },
      // 修改房源信息 列表
      changeList (state, { payload }) {
        
        return {
          ...state,
          houseList: payload.list,
        }
      },
      changeColumns (state, { payload }) {
        
        // columns
        return {
          ...state,
          columns: payload.list,
          columnsChecked: payload.columnsChecked,
        }
      },
      clearColumns(state) {
        return {
          ...state,
          columns: [],
          columnsChecked: {},
          isCheckedList: [],
        }
      },
      // 保存选中的数据
      saveCheckedList (state, { payload }) {
        return {
          ...state,
          isCheckedList: payload.list
        }
      },
      testList (state, { payload }) {
        return {
          ...state,
          testList: payload.data
        }
      },
      // 存储楼栋列表
      saveBuildinglist (state, { payload }) {
        return {
          ...state,
          buildinglist: payload.data
        }
      },
      // 存储户型列表
      savehouseTypeList (state, { payload }) {
        return {
          ...state,
          houseTypeList: payload.data
        }
      },
      // 存储houseTypeIdList
      savehouseTypeId (state, { payload }) {
        return {
          ...state,
          houseTypeId: payload.data
        }
      },
      // 保存日志列表
      saveLoglist (state, { payload }) {
        return {
          ...state,
          loglist: payload.data
        }
      },
      // 保存bfProjectId status
      saveQuery (state, { payload }) {
        return {
          ...state,
          bfProjectId: payload.bfProjectId,
          status: payload.status
        }
      },
      saveStatus (state, { payload }) {
        return {
          ...state,
          status: payload.status
        }
      },
      // oa楼栋名称列表
      saveOaBuildingNameList (state, { payload }) {
        return {
          ...state,
          oaBuildingNameList: payload.data
        }
      },
      // oa楼栋名称列表
      saveShowNameList (state, { payload }) {
        return {
          ...state,
          showNameList: payload.data
        }
      },
      // 存储楼栋信息bfBuildingId
      saveBfBuildingId (state, { payload }) {
        return {
          ...state,
          bfBuildingId: payload.bfBuildingId
        }
      },
      // 保存楼盘信息
      saveProjectInformation (state, { payload }) {
        return {
          ...state,
          projectInformation: payload.data,
          mediaImages: payload.data.fileList
        }
      },
      // 保存富文本信息
      saveUeditorInfo (state, { payload }) {
        return {
          ...state,
          ueditorInfo: payload
        }
      },
      onPreview (state,{ payload }){
        return { ...state, ...payload }
      },
      onCancel (state,{ payload }){
        return { ...state,...payload,
        }
      },
      removeImg (state, {payload}){
        return {
          ...state,
          mediaImages: payload.data,
        }
      },
      // 保存销售楼栋树状列表
      saveTreeList (state, {payload}){
        return {
          ...state,
          treeList: payload.data,
        }
      },
      // 存储查询的富文本
      ueditorInfoSave (state, {payload}){
        return {
          ...state,
          initHyperText: payload.data.readInfo,
        }
      },
      // 存储优惠政策查询的富文本
      ueditorPreInfoSave (state, {payload}){
        return {
          ...state,
          preferentialInfo: payload.data
        }
      },
      // 销售楼栋显示与否
      createIsShow (state, {payload}){
        return {
          ...state,
          visibleCreate: payload
        }
      },
      // 存储房源详情
      saveHouseDetil (state, {payload}){
        return {
          ...state,
          houseDetilList: payload.data
        }
      },
      // 房源详情显示
      setDetailShow (state, {payload}){
        return {
          ...state,
          detailShow: payload
        }
      },
      // 保存优惠政策富文本信息
      savePreUeditorInfo(state, {
        payload
      }) {
        return {
          ...state,
          ueditorPreInfo: payload
        }
      },
      savePreUeditor (state, { payload }) {
        return {
          ...state,
          ueditorPre: payload,
        }
      },
      
      // 关注和浏览
      saveCountAndScan (state, {payload}){
        return {
          ...state,
          countAndScan: payload.data,
        }
      },
      // 富文本多图片
      changeModalStatus (state, { payload }) {
        return {
          ...state,
          isShowModal: payload.showModal,
        }
      },
      // 存储房源信息，勾选房源时传过来的this
      saveThat (state, { payload }) {
        return {
          ...state,
          that: payload.data,
        }
      },
      // 防止添加销售楼栋点击多次
      setFloorShow (state, { payload }) {
 
        
        return {
          ...state,
          createFloorShow: payload,
        }
      },
      setClickShow (state, { payload }) {
        return {
          ...state,
          createClickShow: payload,
        }
      },
      // 户型优惠列表
      saveHouseTypeDiscountList (state, { payload }) {
        return {
          ...state,
          houseTypeDiscountList: payload.data.list,
          discountPagination: payload.data.pagination
        }
      },
      // 保存 户型优惠分页
      saveDiscountOnchangePage (state, { payload }) {
        return {
          ...state,
          discountPage: payload
        }
      },
      // 保存优惠政策富文本内容
      savePreContent (state, { payload }) {
        return {
          ...state,
          preContent: payload
        }
      },
    },
  }
);
