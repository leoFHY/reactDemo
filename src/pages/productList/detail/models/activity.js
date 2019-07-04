/* global window */
import modelExtend from 'dva-model-extend'
import { filterModelNoPage } from 'utils/model'
import { message } from 'antd';
import { deepCopy } from 'utils/copy'
import moment from 'moment';
import {
  queryList,
  discountHouse,
  addOrUpdateSpecialOffer,
  deleteSpecialOffer,
  specialOfferDetail,
  updateShowSpecialOffer,
} from '../services'

export default modelExtend(
  filterModelNoPage({ reqFn: queryList, namespace: 'detailActivity'}),
  {
    namespace: 'detailActivity',
    state: {
      typeList: [{
        id: '1',
        name: '蓝光员工',
      }, {
        id: '2',
        name: '业主／租户／商户',
      }, {
        id: '3',
        name: '供应商',
      }, 
      // {
      //   id: '5',
      //   name: '手牵手',
      // }
      {
        id: '6',
        name: '蓝朋友',
      }
    ],
      activityStatus: [{
        id: '0',
        name: '未开始',
      }, {
        id: '1',
        name: '进行中',
      }, {
        id: '2',
        name: '已结束',
      }],
      // 多选框使用
      typeCheck: [{
        value: '1',
        label: '蓝光员工',
      }, {
        value: '2',
        label: '业主／租户／商户',
      }, {
        value: '3',
        label: '供应商',
      }, 
      // {
      //   value: '5',
      //   label: '手牵手',
      // }
      {
        value: '6',
        label: '蓝朋友',
      }
    ],
      // 房源列表
      treeList: [],
      // 房源显示与否
      treeShow: false,
      // 房源id
      houseId: '',
      houseName: '',
      // 编辑回显数据
      editData: {},
      // 详情数据
      detailData: {}, 
      // 保存图片
      listImg: [],
      previewShow: false,
      previewSrc: '',
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen(location => {
       
        // });
      },
    },

    effects: {
       // 查询 优惠房源列表
      *getHouse ({ payload,success }, { put, call }) {
        const ret = yield call(discountHouse, payload);
        const { code,  data } = ret
        if (code === 'S000000') {
          success && success()
          const dataList = []
          const generateList = (data) => {
            let children = []
            for (let i = 0; i < data.length; i += 1) {
              const node = data[i]
              const name = node.houseName
              children.push({
                key: node.houseId,
                title: name,
              })
              if (node.houseList) {
                children[i].children = generateList(node.houseList)
              }

            }
            return children
          }
          // generateList(data)
          data.forEach((v, i) => {
            dataList.push({
              key: v.buildingId,
              title: v.buildingName,
              disable: '0',
              children: generateList(v.houseList)
            })
          })
          yield put ({
            type: 'saveTreeList',
            payload: {
              data: dataList
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 新增/修改优惠活动
      *editShow ({ payload,success }, { put, call,select }) {
        const ret = yield call(addOrUpdateSpecialOffer, payload);
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        const { code } = ret
        if (code === 'S000000') {
          success && success()
          message.success('操作成功')
          yield put({
            type: 'getPageList',
            payload: {
              bfProjectId,
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 新编辑回显数据请求
      *editOpen ({ payload,success }, { put, call }) {
        const ret = yield call(updateShowSpecialOffer, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          let list = deepCopy(data)
          if (data.startDate) {
            list.time = [moment(data.startDate), moment(data.endDate)]
          } else {
            list.time = []
          }
          if (data.identityTypes) {
             list.types = data.identityTypes.split(',')
          }
          if (data.intervalDownPrice) {
             list.intervalDownPrice = data.intervalDownPrice.toString()
          }
          if (data.intervalSecond) {
            list.intervalSecond = data.intervalSecond.toString()
          }
          if (data.minAmount) {
            list.minAmount = data.minAmount.toString()
          }
          if (data.startAmount) {
            list.startAmount = data.startAmount.toString()
          }
          let listImg = []
          listImg[0] = {}
          listImg[0].uid = 1
          listImg[0].url = list.houseDiscountPic
          yield put({
            type: 'saveEditData',
            payload: {
               list,
               listImg
            },
          })
          yield put({
            type: 'saveHouseId',
            payload: {
              houseId: data.houseId,
              houseName: data.houseName
            },
          })
          
          success && success()
        } else {
          message.warning(ret.message)
        }
      },
       // 删除
      *goDel ({ payload }, { put, call, select }) {
        const ret = yield call(deleteSpecialOffer, payload);
        const bfProjectId = yield select(state => state.filterDetail.bfProjectId)
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
          yield put({
            type: 'getPageList',
            payload: {
              bfProjectId,
            },
          })
          
        } else {
          message.warning(ret.message)
        }
      },
       // 详情
      *getDetail ({ payload,success }, { put, call}) {
        const ret = yield call(specialOfferDetail, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          let list = deepCopy(data)
          if(data.identity) {
            list.type = data.identity.split(',')
          }
          
          yield put({
            type: 'saveDetail',
            payload: {
              data: list,
            },
          })
           success && success()
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      // 保存优惠房源列表
      saveTreeList (state, { payload }) {
        return {
          ...state,
          treeList: payload.data,
        };
      },
      // 改变优惠房源显示状态
      changeTreeShow (state, { payload }) {
        return {
          ...state,
          treeShow: payload,
        };
      },
      // 保存房源ID
      saveHouseId (state, { payload }) {
        return {
          ...state,
          houseId: payload.houseId,
          houseName: payload.houseName,
        };
      },
      // 保存编辑回显数据
      saveEditData (state, { payload }) {
        return {
          ...state,
          editData: payload.list,
          listImg: payload.listImg,
        };
      },
      // 保存详情
      saveDetail (state, { payload }) {
        return {
          ...state,
          detailData: payload.data
        };
      },
      // 保存图片
      saveMediaImages (state, { payload }) {
        return {
          ...state,
          listImg: payload.data,
        };
      },
      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      removeImg (state, {payload}){
        return {
          ...state,
          listImg: [],
        }
      },
    } 
  });
