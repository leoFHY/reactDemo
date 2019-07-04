/* global window */
import modelExtend from 'dva-model-extend'
import { filterModelNoPage } from 'utils/model'
import { message } from 'antd';
import { deepCopy } from 'utils/copy'
import moment from 'moment';
import {
  provinceCity,
  queryDetail,
  updateDetail,
  uploadPicture,
  addProjectTag,
  projectTagList,
  updateProjectTagRel
} from '../services/buildingInfoApi'

export default modelExtend(
  // filterModelNoPage({ reqFn: queryList, namespace: 'buildingInfo'}),
  {
    namespace: 'buildingInfo',
    state: {
      provinceList:[],
      cityList:[],
      ProjectInformationList:{},
      listImg: [],
      // h5图片
      listImg1: [],
      previewShow:false,
      previewSrc:'',
      lgMapAddress:'',
      labelList: [],
      labelInfo: '',
    },

    effects: {
       // 查询
      *getProvince ({ payload }, { put, call }) {
        const ret = yield call(provinceCity, payload)
        let { code, data } = ret
        // console.log(data)
        if (code && code === 'S000000') {
          
           yield put ({
             type: 'saveProvinceList',
             payload:{
               data
             }
           })
        } else {
          message.warning(ret.message)
        }
      },
      //城市列表
      *getCity ({ payload,success }, { put, call }) {
        const ret = yield call(provinceCity, payload)
        let { code, data } = ret
        // console.log(data)
        if (code && code === 'S000000') {
          
          yield put ({
             type: 'saveCityList',
             payload:{
               data
             }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 楼盘信息查询
      * searchProjectInfo({ payload, success }, { put, call }) {
        const ret = yield call(queryDetail, payload)
        let { code, data } = ret
        if (code && code === 'S000000') {
           
          // console.log(data)
          if(data.buildPic){
             let fileList = [];
             fileList[0] = {}
             fileList[0].uid = 1
             fileList[0].status = 'done'
             fileList[0].url = data.buildPic
             data.fileList = fileList
          } else {
             data.fileList = []
          }
          if (data.h5Pic) {
            let fileList = [];
            fileList[0] = {}
            fileList[0].uid = 1
            fileList[0].status = 'done'
            fileList[0].url = data.h5Pic
            data.fileList1 = fileList
          } else {
            data.fileList1 = []
          }
          yield put ({
            type: 'saveProjectInformation',
            payload:{
              data
            }
          })
          // 查询城市
          success && success(data)
          //鸟瞰图数据保存在filterDetail
          // yield put({
          //   type: 'filterDetail/saveProjectInformation',
          //   payload:{
          //     data
          //   }
          // })
        
      
        } else {
          message.warning(ret.message)
        }
      },
      // 楼盘更新
      * pjInfoUpdate({ payload, success }, { put, call }) {
        const ret = yield call(updateDetail, payload)
        let { code, data } = ret
        if (code && code === 'S000000') {
          success && success()
          // console.log(111)
          //  message.success('保存成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 标签列表
      * getTagList({ payload }, { put, call }) {
        const ret = yield call(projectTagList, payload)
        let { code, data } = ret
        if (code && code === 'S000000') {
           yield put ({
             type: 'changeChoose',
             payload:{
               data
             }
           })
        } else {
          message.warning(ret.message)
        }
      },
      // 自定义标签
      * addLabel({ payload }, { put, call, select }) {
        const ret = yield call(addProjectTag, payload)
        const bfProjectId = yield select(state => state.filterDetail)
        let { code, data } = ret
        if (code && code === 'S000000') {
           yield put ({
             type: 'getTagList',
             payload:{
               bfProjectId,
             }
           })
           yield put({
             type: 'saveLabelInfo',
             payload: {
               data: '',
             }
           })
        } else {
          message.warning(ret.message)
        }
      },
      // 更新标签
      * updateLabel({ payload }, { put, call }) {
        const ret = yield call(updateProjectTagRel, payload)
        let { code } = ret
        if (code && code === 'S000000') {
            message.success("保存成功")
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      // 保存省份列表
      saveProvinceList (state, { payload }) {
        // console.log(payload)
        return {
          ...state,
          provinceList: payload.data,
        };
      },
      // 保存城市列表
      saveCityList (state, { payload }) {
        // console.log(payload)
        return {
          ...state,
          cityList: payload.data,
        };
      },
      //详细信息
      saveProjectInformation (state, { payload }) {
        // console.log(payload.data)
        return {
          ...state,
          ProjectInformationList: payload.data,
          // listImg: payload.data.fileList
        };
      },
      saveMap (state, { payload }) {
        return {
          ...state.ProjectInformationList,
          ...payload,
        };
      },
      //保存鸟瞰图片
      saveMediaImages (state, {payload}) {
        // console.log(payload.data)
        return {
          ...state,
          listImg: payload.data,
        }
      },
      //保存h5图片
      saveMediaImages1 (state, {payload}) {
        // console.log(payload.data)
        return {
          ...state,
          listImg1: payload.data,
        }
      },
      

      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      //保存经纬度
      savelgMapAddress (state, {payload}) {
        // console.log(payload.data)
        return {
          ...state,
          lgMapAddress: payload.data,
        }
      },
      // 改变选中状态、、保存标签列表
      changeChoose (state, { payload }) {
        return {
          ...state,
          labelList: payload.data,
        };
      },
      saveLabelInfo (state, { payload }) {
        return {
          ...state,
          labelInfo: payload.data,
        };
      },
    } 
  });
