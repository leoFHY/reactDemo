import modelExtend from 'dva-model-extend'
import { message } from 'antd'

import {deepCopy} from './copy'
export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },
})

export const filterModel = function (options) {
  return {
    state: {
      dataSource: [],
      pagination: {
        showQuickJumper: true,
        total: 0,
        showTotal(total) {
          return `共 ${total} 条`
        },
        current: 1,
      },
      searchData: {
        pageNum :1,
        pageSize :10
      },
      changePage: 1,
    },
    effects: {
      *getPageList({ payload, cb, isDownload }, { put, call, select }) {
        let reqFn = options.reqFn
        // 保存搜索数据
        if (payload.type === 'search') {
          payload = payload.data
          yield put({
            type: 'saveSearchData',
            payload,
          })
        } else if (payload.type === 'reset') {
          payload = payload.data
          yield put({
            type: 'restSearchData',
            payload, // 改动，有些需求置空时需要传id
          })
        }  else if (payload.type === 'page') {
          payload = payload.data
          // console.log(payload)
          yield put({
            type: 'saveSearchData',
            payload, // 改动，有些需求置空时需要传id
          })
        }
        // 克隆一下防止合并对象时提示无法分配只读文件
        payload = deepCopy(payload)
        const searchData = yield select(state => state[options.namespace].searchData)
        // 添加搜索数据
        if (searchData) {
         Object.assign(payload, searchData)
          // payload = deepCopy(searchData)
        }
        // console.log(payload)
        // 导出
        if (isDownload) {
          reqFn = options.downloadFn
        }
        const ret = yield call(reqFn, payload)
        if (isDownload) return

        if (ret.code === 'S000000') {
          ret.data.list.map((item) => {
            item.isRelease = true
          })
          yield put({
            type: 'pageList',
            payload: ret.data,
          })
          cb && cb()
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      pageList (state, { payload }) {
        const { pageNum, total, list } = payload
        // console.log(list)
        return {
          ...state,
          pagination: { ...state.pagination, total, current: pageNum },
          dataSource: list,
        }
      },
      saveSearchData (state, { payload }) {
        // console.log({ ...state.searchData,...payload })
        return { 
          ...state, 
          searchData:  { ...state.searchData,...payload }
        }
      },
      restSearchData (state, { payload }) {
        return { 
          ...state, 
          searchData: payload.data
        }
      },
      changeDataSource (state, { payload }) {
        return { ...state, dataSource: payload.list }
      },
      saveOnchangePage (state, { payload }) {
        return {
          ...state,
          changePage: payload,
        }
      },
    },
  }
}

