import { message } from 'antd'
import { page, getDictInfo, add, update, getType, deletes } from './service'

export default {
  namespace: 'dictionary',
  state: {
    loading: false,
    pageList: [],
    pageListTree: [],
    sortData: [],
    activeKey: '1',
    activeTxt: '字典添加',
    treeData: [],
    detailData: {},
    typeList: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/backStageManagement/dictionary') {
          const { item } = location.state || {}
          dispatch({
            type: 'getList',
            payload: {
              pageNum: '1',
              itemData: item,
            },
          })
          dispatch({
            type: 'getType',
            payload: {},
          })
        } else if (location.pathname === '/backStageManagement/dictionary/add') {
          const { item, dictId } = location.query
          const { type, description, sort } = location.state || {}
          dispatch({
            type: 'getDictInfo',
            payload: {
              item,
              dictId,
              type,
              description,
              sort,
            },
          })
        }
      })
    },
  },
  effects: {
    * getList ({ payload }, { put, call, select }) {
      if (payload.itemData) {
        payload.pageNum = yield select(state => state.dictionary.pageList.pageNum)
        payload.type = yield select(state => state.dictionary.type)
        payload.description = yield select(state => state.dictionary.description)
      }
      const ret = yield call(page, payload)
      const pageList = ret.data
      if (ret.code === 'S000000') {
        yield put({
          type: 'pageList',
          payload: {
            pageList,
            type: payload.type,
            description: payload.description,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * getType ({ payload }, { put, call }) {
      const ret = yield call(getType)
      const typeList = ret.data
      if (ret.code === 'S000000') {
        yield put({
          type: 'typeList',
          payload: {
            typeList,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * getDictInfo ({ payload }, { put, call }) {
      const { item, dictId, type, description, sort } = payload
      let detailData = {}
      if (item === 'tabAdd') { // 点击头部添加
        detailData = {}
      } else if (item === 'listAdd') { // 点击列表页添加
        detailData = { type, description, sort }
      } else if (item === 'update') { // 修改
        const ret = yield call(getDictInfo, { dictId })
        if (ret.code === 'S000000') {
          detailData = ret.data
          detailData.typeItem = 'update'
        } else {
          message.error(ret.message)
        }
      }
      yield put({
        type: 'detailData',
        payload: {
          detailData,
        },
      })
    },
    * deletes ({ payload, backIndex }, { call, select, put }) {
      const ret = yield call(deletes, payload)
      const pageList = yield select(state => state.dictionary.pageList)
      const type = yield select(state => state.dictionary.type)
      const description = yield select(state => state.dictionary.description)
      if (ret.code === 'S000000') {
        message.success('删除成功')
        yield put({ type: 'getList', payload: { pageNum: pageList.pageNum, type, description } })
      } else {
        message.error(ret.message)
      }
    },
    * add ({ payload, backIndex }, { call }) {
      const ret = yield call(add, payload)
      if (ret.code === 'S000000') {
        message.success('添加成功')
        if (backIndex) {
          backIndex()
        }
      } else {
        message.error(ret.message)
      }
    },
    * update ({ payload, backIndex }, { call }) {
      const ret = yield call(update, payload)
      if (ret.code === 'S000000') {
        message.success('修改成功')
        if (backIndex) {
          backIndex()
        }
      } else {
        message.error(ret.message)
      }
    },
  },
  reducers: {
    pageList (state, { payload }) {
      const { pageList, type, description } = payload
      return {
        ...state,
        pageList,
        type,
        description,
      }
    },
    typeList (state, { payload }) {
      return {
        ...state,
        typeList: payload.typeList,
      }
    },
    detailData (state, { payload }) {
      return {
        ...state,
        detailData: payload.detailData,
      }
    },
    backIndex (state) {
      return {
        ...state,
        detailData: {},
      }
    },
  },
}
