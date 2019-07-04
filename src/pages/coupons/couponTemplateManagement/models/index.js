import { message } from 'antd'
import { router } from 'utils'
import { deepCopy } from 'utils/copy'
import {
  add,
  deleteTem,
  detail,
  disable,
  enable,
  pageList,
  pageListSkuFD,
  update,
  addGoodsList,
} from '../../services/index'
import { getName } from 'utils/transformData'

export default {
  namespace: 'couponTemplate',
  state: {
    loading: false,
    pageNum: '1',
    pageSize: '10',
    temList: [],
    pageCount: 10,
    stateList: [
      { name: '新建', id: '1' },
      { name: '启用', id: '2' },
      { name: '禁用', id: '3' },
      { name: '删除', id: '4' },
    ],
    useType: [
      { name: '代金', id: 'M' },
      { name: '兑换', id: 'T' },
      { name: '折扣', id: 'D' },
    ],
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    searchData: null,
    addGoodSearchData: null,
    addGoodList: [],
    addGoodPageNum: '1',
    addGoodPageSize: '5',
    addGoodPageCount: 10,
    selectedGoods: [],
    selectedRowKeys: [],
    temporarySelectedGoods: [],
    temporarySelectedRowKeys: [],
    detailData: null,
  },
  reducers: {
    temList (state, { payload }) {
      const { pageNum, pageCount, list } = payload
      return {
        ...state,
        pageNum,
        pageCount,
        temList: list,
      }
    },
    saveSearchData (state, { payload }) {
      return { ...state, searchData: payload }
    },
    saveAddGoodSearchData (state, { payload }) {
      return { ...state, addGoodSearchData: payload }
    },
    listForAddGood (state, { payload }) {
      const { pageNum, pageCount, list } = payload
      return {
        ...state,
        addGoodPageNum: pageNum,
        addGoodPageCount: pageCount,
        addGoodList: list,
      }
    },
    temporarySelectedGoods (state, { payload }) {
      return {
        ...state,
        temporarySelectedGoods: payload.selectRows,
        temporarySelectedRowKeys: payload.selectedRowKeys,
      }
    },
    saveSelectedGoods (state, { payload }) {
      if (payload !== 'add') {
        state.temporarySelectedGoods = state.selectedGoods.concat()
        state.temporarySelectedRowKeys = state.selectedRowKeys.concat()
      }
      return {
        ...state,
        selectedGoods: (payload && payload.selectRows) || state.temporarySelectedGoods.concat(),
        selectedRowKeys: (payload && payload.selectedRowKeys) || state.temporarySelectedRowKeys.concat(),
      }
    },
    clearSelectedGoods (state) {
      return {
        ...state,
        selectedGoods: [],
        selectedRowKeys: [],
        temporarySelectedGoods: [],
        temporarySelectedRowKeys: [],
      }
    },
    detailData (state, { payload }) {
      return { ...state, detailData: payload }
    },
    clearData (state) {
      return { ...state, detailData: null }
    },
  },
  effects: {// action 执行函数
    * getTemList ({ payload }, { put, call, select }) {
      // 保存搜索数据
      if (payload.type === 'search') {
        payload = payload.data
        yield put({
          type: 'saveSearchData',
          payload,
        })
      }
      const searchData = yield select(state => state.couponTemplate.searchData)
      console.log(searchData)
      // 添加搜索数据
      let list = deepCopy(payload)
      if (searchData) {
        const { createTimeFrom, createTimeTo, name, state, useType } = searchData
        console.log(createTimeFrom)
        Object.assign(list, {
          createTimeFrom,
          createTimeTo,
          state,
          name,
          useType,
        })
      }
      const ret = yield call(pageList, list)
      // 转换状态
      const stateList = yield select(state => state.couponTemplate.stateList)
      const useType = yield select(state => state.couponTemplate.useType)
      ret.data.list.forEach((v) => {
        v.state = getName(v.state, stateList)
        v.useType = getName(v.useType, useType)
      })
      if (ret.code === 'S000000') {
        yield put({
          type: 'temList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * deleteTem ({ payload }, { put, call, select }) {
      const ret = yield call(deleteTem, payload)
      const pageNum = yield select(state => state.couponTemplate.pageNum)
      const pageSize = yield select(state => state.couponTemplate.pageSize)
      if (ret.code === 'S000000') {
        message.success('删除成功！')
        yield put({
          type: 'getTemList',
          payload: {
            pageNum,
            pageSize,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getListForAddGood ({ payload }, { put, call, select }) {
      // 保存搜索数据
      if (payload.type === 'search') {
        payload = payload.data
        yield put({
          type: 'saveAddGoodSearchData',
          payload,
        })
      }
      const searchData = yield select(state => state.couponTemplate.addGoodSearchData)
      // 添加搜索数据
      if (searchData) {
        const { skuMeom } = searchData
        Object.assign(payload, {
          skuMeom,
        })
      }
      const ret = yield call(addGoodsList, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'listForAddGood',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * disable ({ payload }, { put, call, select }) {
      const ret = yield call(disable, payload)
      const pageNum = yield select(state => state.couponTemplate.pageNum)
      const pageSize = yield select(state => state.couponTemplate.pageSize)
      if (ret.code === 'S000000') {
        message.success('禁用成功！')
        yield put({
          type: 'getTemList',
          payload: {
            pageNum,
            pageSize,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * enable ({ payload }, { put, call, select }) {
      const ret = yield call(enable, payload)
      const pageNum = yield select(state => state.couponTemplate.pageNum)
      const pageSize = yield select(state => state.couponTemplate.pageSize)
      if (ret.code === 'S000000') {
        message.success('启用成功！')
        yield put({
          type: 'getTemList',
          payload: {
            pageNum,
            pageSize,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * add ({ payload }, { call }) {
      const ret = yield call(add, payload)
      if (ret.code === 'S000000') {
        message.success('添加优惠券模板成功！')
        router.push({
          pathname: '/coupons/couponTemplateManagement',
        })
      } else {
        message.warning(ret.message)
      }
    },
    * detail ({ payload }, { put, call }) {
      const ret = yield call(detail, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'detailData',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * update ({ payload }, { call }) {
      const ret = yield call(update, payload)
      if (ret.code === 'S000000') {
        message.success('更新优惠券模板成功！')
        router.push({
          pathname: '/coupons/couponTemplateManagement',
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getHaveAddGoods ({ payload }, { call, put }) {
      const ret = yield call(pageListSkuFD, payload)
      if (ret.code === 'S000000') {
        const selectedRowKeys = []
        ret.data.list.forEach((v) => {
          selectedRowKeys.push(v.id)
        })
        yield put({
          type: 'saveSelectedGoods',
          payload: {
            selectRows: ret.data.list,
            selectedRowKeys,
          },
        })
        yield put({
          type: 'temporarySelectedGoods',
          payload: {
            selectRows: ret.data.list.concat(),
            selectedRowKeys: selectedRowKeys.concat(),
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getSelectedGoods ({ payload }, { put, select }) {
      let selectRows = yield select(state => state.couponTemplate.temporarySelectedGoods)
      let selectedRowKeys = yield select(state => state.couponTemplate.temporarySelectedRowKeys)

      if (payload.selected) {
        selectRows = selectRows.concat(payload.selectRow || payload.selectRows)
        selectedRowKeys = selectedRowKeys.concat(payload.selectedRowKey || payload.selectedRowKeys)
      } else {
        console.log('全选的数据', payload.selectedRowKeys)
        console.log('储存的数据', selectRows)
        if (payload.selectedRowKeys) {
          selectRows = selectRows.filter((v) => {
            return payload.selectedRowKeys.findIndex((val) => {
              return val === v.id
            }) === -1
          })
          selectedRowKeys = selectedRowKeys.filter((v) => {
            return payload.selectedRowKeys.findIndex((val) => {
              return val === v
            }) === -1
          })
        } else {
          selectRows = selectRows.filter((v) => {
            return v.id && v.id !== payload.selectedRowKey
          })
          selectedRowKeys = selectedRowKeys.filter((v) => {
            return v !== payload.selectedRowKey
          })
        }
      }
      console.log('temporarySelectedGoods', selectRows, selectedRowKeys)
      yield put({
        type: 'temporarySelectedGoods',
        payload: {
          selectRows,
          selectedRowKeys,
        },
      })
    },
  },
}
