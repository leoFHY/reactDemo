import { message } from 'antd'
import { couponPageListS, couponDetailS, couponOrderListS, exportDocS } from '../../services/index'

export default {
  namespace: 'couponManagement',
  state: {
    loading: false,
    pageNum: 1,
    pageSize: 10,
    pageList: [],
    pageCount: '',
    batchName: '',
    couponNo: '',
    bindState: '',
    couponDefName: '',
    orderNo: '',
    supplyName: '',
    beginDate: '',
    endDate: '',
    updateTimeFrom: '',
    updateTimeTo: '',
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    detail: {},
    orderList: [],
    stateList: [
      { name: '', id: '' },
      { name: '已绑定', id: '1' },
      { name: '未绑定', id: '0' },
    ],
    couponList: [
      { name: '代金券', id: 'M' },
      { name: '兑换券', id: 'T' },
      { name: '折扣券', id: 'D' },
    ],
  },
  reducers: {
    getPageList (state, { payload }) {
      let pageList = payload.list
      console.log(payload)
      pageList.map((item) => {
        item.bindState = item.bindState === '1' ? '已绑定' : item.bindState === '0' ? '未绑定' : ''
        item.useType = item.useType === 'M' ? '代金' : item.useType === 'T' ? '兑换' : item.useType === 'D' ? '折扣' : ''
        return item
      })
      return {
        ...state,
        pageList,
        pageCount: payload.pageCount,
        pageNum: payload.pageNum,
        pageSize: payload.pageSize,
        total: payload.total,
      }
    },
    getDetail (state, { payload }) {
      return {
        ...state,
        detail: payload,
      }
    },
    changeBatch (state, { payload }) {
      return {
        ...state,
        batchName: payload.batchName,
      }
    },
    changeCouponNo (state, { payload }) {
      return {
        ...state,
        couponNo: payload.couponNo,
      }
    },
    changeBindState (state, { payload }) {
      return {
        ...state,
        bindState: payload.bindState,
      }
    },
    changeCouponDefName (state, { payload }) {
      return {
        ...state,
        couponDefName: payload.couponDefName,
      }
    },
    changeOrderNo (state, { payload }) {
      return {
        ...state,
        orderNo: payload.orderNo,
      }
    },
    changeSupplyName (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        supplyName: payload.supplyName,
      }
    },
    changeBeginDate (state, { payload }) {
      console.log(payload)
      return {
        ...state,
        updateTimeFrom: payload.updateTimeFrom,
      }
    },
    changeEndDate (state, { payload }) {
      return {
        ...state,
        updateTimeTo: payload.updateTimeTo,
      }
    },
    saveSearchData (state, { payload }) {
      return {
        ...state,
        batchName: payload.batchName,
        couponNo: payload.couponNo,
        bindState: payload.bindState,
        couponDefName: payload.couponDefName,
        orderNo: payload.orderNo,
        supplyName: payload.supplyName,
        cardNo: payload.cardNo,
        updateTimeFrom: payload.updateTimeFrom,
        updateTimeTo: payload.updateTimeTo,
      }
    },
    changeAll (state) {
      return {
        ...state,
        batchName: '',
        couponNo: '',
        bindState: '',
        couponDefName: '',
        orderNo: '',
        supplyName: '',
        updateTimeFrom: '',
        updateTimeTo: '',
      }
    },
  },
  effects: {// action 执行函数
    * couponPageList ({ payload }, { put, call }) {
      if (payload.type === 'search') {
        let payload2 = { ...payload }
        yield put({
          type: 'saveSearchData',
          payload: payload2,
        })
        const {
          batchName = '', couponNo = '', bindState = '', couponDefName = '', orderNo = '',
          supplyName = '', updateTimeFrom = '', updateTimeTo = '', pageNum, pageSize,
        } = payload2

        payload = {
          batchName,
          couponNo,
          bindState,
          couponDefName,
          orderNo,
          supplyName,
          updateTimeFrom,
          updateTimeTo,
          pageNum,
          pageSize,
        }
      }
      const ret = yield call(couponPageListS, payload)
      console.log(ret)
      if (ret.code === 'S000000') {
        yield put({
          type: 'getPageList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * couponDetail ({ payload }, { put, call }) {
      const ret = yield call(couponDetailS, payload)
      ret.data.orderList = []
      console.log(payload, ret)
      if (ret.code === 'S000000') {
        let orderNo2 = ret.data.orderNo
        console.log(orderNo2)
        if (orderNo2) {
          console.log('====优惠券列表===')
          const ret2 = yield call(couponOrderListS, { orderNo: orderNo2 })
          if (ret2.code === 'S000000') {
            ret.data.orderList.push(ret2.data)
          } else {
            message.warning(ret.message)
          }
        }
        yield put({
          type: 'getDetail',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * exportDoc ({ payload }, { put, call }) {
      const ret = yield call(exportDocS, payload)
      console.log('=========exportDoc=========')
      console.log(put, ret)
      console.log(payload)
    },
  },
}
