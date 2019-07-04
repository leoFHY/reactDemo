/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'

import { pageModel,filterModel } from 'utils/pmodel'
import { deepCopy } from 'utils/copy'
import { message } from 'antd'
import {
  addHouseType,
  deleteHouseType,
  houseTypeNameList,
  houseTypeStructureList,
  houseTypePageList
} from '../services/HouseTypeApi'

export default modelExtend(
  filterModel({ reqFn: houseTypePageList, namespace: 'HouseManagement'}),
  {
    namespace:'HouseManagement',
    state: {
      
      houseTypeNameList:[],
      bfProjectId:'',
      houseTypeStructureList:[],
      listImg:[],
      editList:{},
      previewShow:false,
      previewSrc:'',
      addHouseTypeList:[],
      houseTypePageList:[],
      modelHouseTypeList: ['A户型','B户型','C户型','D户型','E户型','F户型','G户型','H户型','自定义'],
      mainForce : [
        {houseType:'一室'},
        {houseType:'二室'},
        {houseType:'三室'},
        {houseType:'四室'},
        {houseType:'四室以上'},
        {houseType:'独栋'},
        {houseType:'联排'},
        {houseType:'叠拼'},
      ],
      propertyTypeList: [
        {status:'1',type:'公寓'},
        {status:'2',type:'住宅'},
        {status:'3',type:'商铺'},
        {status:'4',type:'车位'}
      ]
     
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen(location => {
        //   if (location.pathname === '/productList/detail') {
        //     console.log('=------',location)
        //     dispatch({
        //       type: 'getPageList',
        //       payload: {
        //         pageNum: 1,
        //         pageSize: 10
        //       },
        //     })
        //     // dispatch({
        //     //   type:'gethouseTypeNameList',
        //     //   payload:{}
        //     // })
           
            
        //   }
        // })
      },
    },

    effects: {
   
      
      //户型名称下拉框
      *gethouseTypeNameList ({ payload }, { put, select, call }){
        const ret = yield call(houseTypeNameList, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        // console.log('--------',bfProjectId)
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'savehouseTypeNameList',
            payload: {
              data
            }
          })
          //  yield put({
          //   type: 'getPageList',
          //   payload: {
          //     pageNum: 1,
          //     pageSize: 10
          //   },
          // })
        } else {
          message.warning(ret.message)
        }
      },
      //户型结构下拉框
      *gethouseTypeStructureList ({ payload }, { put, select, call }){
        const ret = yield call(houseTypeStructureList, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        // console.log('--------',bfProjectId)
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'savehouseTypeStructureList',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
       //户型添加/修改
       *getaddHouseType ({ payload,success }, { put, select, call }){
        const ret = yield call(addHouseType, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        // console.log('--------',bfProjectId)
        const { code,data } = ret
        if (code === 'S000000') {
          success && success()
          yield put({
            type: 'saveaddHouseType',
            payload: {
              data
            }
          })
           yield put({
            type: 'getPageList',
            payload: {
              pageNum: 1,
              pageSize: 10
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      //户型删除
      *getdeleteHouseType ({ payload,success }, { put, select, call }){
        const ret = yield call(deleteHouseType, payload)
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        // console.log('--------',bfProjectId)
        const { code,data } = ret
        if (code === 'S000000') {
          success && success()
          yield put({
            type: 'savedeleteHouseType',
            payload: {
              data
            }
          })
          
          //  yield put({
          //   type: 'getPageList',
          //   payload: {
          //     pageNum: 1,
          //     pageSize: 10
          //   },
          // })
        } else {
          message.warning(ret.message)
        }
      },
      
    }, 
    reducers: {
      // 存储户型名称列表
      savehouseTypeNameList (state, { payload }) {
      
        return {
          ...state,
          houseTypeNameList: payload.data,
        }
      },
      // 存储户型结构下拉框列表
      savehouseTypeStructureList (state, { payload }) {
      
        return {
          ...state,
          houseTypeStructureList: payload.data,
        }
      },

      // savedeleteHouseType (state, { payload }) {
      
      //   return {
      //     ...state,
      //     houseTypeStructureList: payload.data,
      //   }
      // },
      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      // 保存图片
      saveMediaImages (state, { payload }) {
        return {
          ...state,
          listImg: payload.data,
        };
      },
      // 保存添加户型
      saveaddHouseType (state, { payload }) {
        return {
          ...state,
          houseTypePageList: payload.data,
        };
      },
      // saveEditList (state, { payload }) {
      //   return {
      //     ...state,
      //     editList: payload.data,
      //     listImg: deepCopy(payload.data.houseTypePic),
      //   };
      // },
    },
  }
)
