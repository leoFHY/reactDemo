import { message } from 'antd'
import { router } from 'utils'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { deepCopy } from 'utils/copy'
import {
  saveBatch,
  pageListBatch,
  makeCouponBatch,
  detailBatch,
  deleteBacth,
  listForSelect,
  initialNum,
  downLoadBatch,
  findByBizType
} from '../../services/index'
// import {
//   findByBizType,
// } from '../../services/giftCard/giftCardTypeService'
import { getName } from 'utils/transformData'

export default {
  namespace: 'couponBatch',
  state: {
    loading: false,
    pageNum: '1',
    pageSize: '10',
    pageList: [],
    pageCount: 10,
    stateList: [
      { name: '新建', id: '1' },
      { name: '入库', id: '2' },
      { name: '删除', id: '3' },
    ],
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    searchData: null,
    cardFaceList: [],
    couponTemList: [],
    initialNum: null,
    detailBatch: {},
    filterStates: {
      startValue: null,
      endValue: null,
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/coupons/couponBatch') {
          dispatch({
            type: 'getPageList',
            payload: {
              type: 'search',
              data: {
                pageNum: '1',
                pageSize: '10',
              },
            },
          })
        } else if (location.pathname === '/couponBatch/form') {
          const query = location.query
          if (query.type !== 'add') {
            dispatch({
              type: 'getDetailBatch',
              payload: {
                id: query.id,
              },
            })
          } else {
            // 清空数据
            dispatch({
              type: 'clearDetailBatch',
            })
          }
          // 获取卡外观
          dispatch({
            type: 'getCardFaceList',
            payload: {
              bizType: '1',
            },
          })
          // 获取优惠券模板
          dispatch({
            type: 'getCouponTem',
          })
          // 获取初始券号
          dispatch({
            type: 'getInitialNum',
          })
        }
      })
    },
  },
  reducers: {
    pageList (state, { payload }) {
      const { pageNum, pageCount, list } = payload
      return {
        ...state,
        pageNum,
        pageCount,
        pageList: list,
      }
    },
    saveSearchData (state, { payload }) {
      return { ...state, searchData: payload }
    },
    cardFaceList (state, { payload }) {
      return { ...state, cardFaceList: payload }
    },
    couponTem (state, { payload }) {
      return { ...state, couponTemList: payload }
    },
    initialNum (state, { payload }) {
      return { ...state, initialNum: payload }
    },
    detailBatch (state, { payload }) {
      return { ...state, detailBatch: payload }
    },
    clearDetailBatch (state) {
      return { ...state, detailBatch: {} }
    },
    handleStates (state, { payload }) {
      console.log(payload)
      // let list = deepCopy(state.filterStates)
      // return
      return { ...state, 
        filterStates: 
        {
          startValue:payload.startValue,
          endValue:payload.endValue
        }
        // Object.assign(state.filterStates, payload) 
      }
    },
  },
  effects: {// action 执行函数
    * getPageList ({ payload }, { put, call, select }) {
      // 保存搜索数据
      if (payload.type === 'search') {
        payload = payload.data
        yield put({
          type: 'saveSearchData',
          payload,
        })
      }
      const searchData = yield select(state => state.couponBatch.searchData)
      // 添加搜索数据
      let list = deepCopy(payload) 
      // let list = payload
      // let list = {}
      if (searchData) {

        const { createTimeStart, createTimeEnd, name, state } = searchData
        // list = { ...payload,
        //     createTimeStart,
        //     createTimeEnd,
        //     state,
        //     name,
        //   }
        Object.assign(list, {
          createTimeStart,
          createTimeEnd,
          state,
          name,
        })
      }
      console.log(list)
      const ret = yield call(pageListBatch, list)
      // 转换状态
      const stateList = yield select(state => state.couponBatch.stateList)
      ret.data.list.forEach((v) => {
        v.time = `${v.beginDate} 至 ${v.endDate}`
        v.state = getName(v.state, stateList)
      })
      if (ret.code === 'S000000') {
        yield put({
          type: 'pageList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * deleteBacth ({ payload }, { put, call, select }) {
      const ret = yield call(deleteBacth, payload)
      const pageNum = yield select(state => state.couponBatch.pageNum)
      const pageSize = yield select(state => state.couponBatch.pageSize)
      if (ret.code === 'S000000') {
        message.success('删除成功！')
        yield put({
          type: 'getPageList',
          payload: {
            pageNum,
            pageSize,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * save ({ payload }, { call }) {
      const ret = yield call(saveBatch, payload)
      if (ret.code === 'S000000') {
        message.success('添加成功！')
        router.push({
          pathname: '/coupons/couponBatch',
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getCardFaceList ({ payload }, { call, put }) {
      const ret = yield call(findByBizType, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'cardFaceList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getCouponTem ({ payload }, { call, put }) {
      const ret = yield call(listForSelect, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'couponTem',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getInitialNum ({ payload }, { call, put }) {
      const ret = yield call(initialNum, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'initialNum',
          payload: ret.data,
        })
      } else {
        message.warning(`${ret.message}`)
      }
    },
    * getDetailBatch ({ payload }, { call, put }) {
      const ret = yield call(detailBatch, payload)
      if (ret.code === 'S000000') {
        const data = ret.data
        data.expiryDate = [moment(data.beginDate), moment(data.endDate)]
        data.applyDateSource = data.applyDate
        data.applyDate = moment(data.applyDate)
        yield put({
          type: 'detailBatch',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * downLoadBatch ({ payload }, { call }) {
      const ret = yield call(downLoadBatch, payload)
    },
    * makeCouponBatch ({ payload }, { put, call, select }) {
      const ret = yield call(makeCouponBatch, payload)
      const pageNum = yield select(state => state.couponBatch.pageNum)
      const pageSize = yield select(state => state.couponBatch.pageSize)
      if (ret.code === 'S000000') {
        message.success('制券成功！')
        yield put({
          type: 'getPageList',
          payload: {
            pageNum,
            pageSize,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
  },
}
