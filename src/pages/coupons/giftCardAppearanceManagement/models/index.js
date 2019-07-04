import { message } from 'antd'
import { hashHistory } from 'dva/router'
import { router } from 'utils'
import { deepCopy } from 'utils/copy'
import {
  getCardFaceList,
  createCardFace,
  updateCardFace,
  findCardFace,
  deleteCardFace,
} from '../services'
import { deepEqual } from 'assert';

export default {
  namespace: 'manageGiftCardList',
  state: {
    cardFaceList: [],
    cardFaceData: {
      name: '',
      fontImg: [],
      backImg: [],
      type: '',
      desc: '',
    },
    typeList: [
      { name: '礼品卡', id: '1' },
      { name: '优惠券', id: '2' },
      { name: '权益卡', id: '3' },
    ],
    pageCount: 30,
    pageNum: 1,
    pageSize: 10,
    total: 10,
    searchData: null,
  },

  reducers: {// action 执行函数
    cardFaceList (state, { payload }) {
      if (payload.cardFaceData) {
        return {
          ...state,
          cardFaceList: payload.cardFaceData.list,
          pageCount: payload.cardFaceData.pageCount,
          pageNum: payload.cardFaceData.pageNum,
          total: payload.cardFaceData.total,
        }
      }
      return { ...state, cardFaceList: [], total: 0 }
    },
    cardFaceData (state, { payload }) {
      const data = payload.cardFaceData
      return {
        ...state,
        cardFaceData: {
          name: data.name,
          fontImg: data.positive ? [
            { uid: 1,
              url: data.positive,
            },
          ] : '',
          backImg: data.otherSide ? [
            { uid: 1,
              url: data.otherSide,
            },
          ] : '',
          type: data.bizType,
          desc: data.describe,
        },
      }
    },
    clearCardFaceData (state) {
      return {
        ...state,
        cardFaceData: {
          name: '',
          fontImg: [],
          backImg: [],
          type: '',
          desc: '',
        },
      }
    },
    changePageNum (state, { payload }) {
      return { ...state, pageNum: 1 }
    },
    saveSearchData (state, { payload }) {
      return { ...state, searchData: payload }
    },
  },

  effects: {
    * getCardFaceList ({ payload }, { put, call, select }) {
      // 保存搜索数据
      if (payload.type === 'search') {
        payload = payload.data
        yield put({
          type: 'saveSearchData',
          payload,
        })
      }
      const searchData = yield select(state => state.manageGiftCardList.searchData)
      // 添加搜索数据
      let list = deepCopy(payload)
      if (searchData) {
        console.log(searchData)
        console.log(22222+ '----')
        const { bizType, name } = searchData
    
        Object.assign(list, {
          bizType,
          name,
        })
        console.log(22222+ '----')
      }
      // console.log(payload)
      const ret = yield call(getCardFaceList, list)
      console.log('列表数据', ret)
      if (ret.code === 'S000000') {
        yield put({
          type: 'cardFaceList',
          payload: {
            cardFaceData: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getCardFaceData ({ payload }, { put, call }) {
      const ret = yield call(findCardFace, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'cardFaceData',
          payload: {
            cardFaceData: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * createCardFace ({ payload }, { call }) {
      const ret = yield call(createCardFace, payload)
      if (ret.code === 'S000000') {
        message.success('新增礼品卡成功！')
        router.push({
          pathname: '/coupons/giftCardAppearanceManagement',
        })
      } else {
        message.warning(ret.message)
      }
    },
    * updateCardFace ({ payload }, { call }) {
      const ret = yield call(updateCardFace, payload)
      if (ret.code === 'S000000') {
        message.success('更新礼品卡成功！')
        router.push({
          pathname: '/coupons/giftCardAppearanceManagement',
        })
      } else {
        message.warning(ret.message)
      }
    },
    * deleteCardFace ({ payload }, { call, put, select }) {
      // const pageNum = yield select(state => state.manageGiftCardList.pageNum)
      const ret = yield call(deleteCardFace, payload)
      if (ret.code === 'S000000') {
        message.success('删除成功！')
        yield put({
          type: 'getCardFaceList',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        yield put({
          type: 'changePageNum',
          payload: {
            pageNum: 1,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
  },
}
