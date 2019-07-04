import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { getArea, deleteArea, addArea, updateArea, getParentAreas }
  from './service'

import { getText } from 'utils/transformData'

export default {
  namespace: 'areaManage',
  state: {
    tabKeys: '1',
    tabText: '新增',
    type: 'add',
    parentId: '',
    AreList: [],
    ParentAreas: [],
    selectAre: {},
    typeList: [
      { name: '国家', id: '1' },
      { name: '省份、直辖市', id: '2' },
      { name: '市', id: '3' },
      { name: '区', id: '4' },
    ],
    isLoading: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/backStageManagement/areaManage').exec(pathname)
        if (match) {
          dispatch({ type: 'getAreaList', payload: {} })
          // dispatch({ type: 'getTree', payload: {} })
          // dispatch({ type: 'getCompany', payload: {} })
          // dispatch({ type: 'getBuildList', payload: {} })
          dispatch({
            type: 'setTabKeys',
            payload: {
              tabKeys: '1',
              tabText: '新增',
              parentId: '',
              type: 'add',
            },
          })
        }
      })
    },
  },
  effects: {
    * getAreaList (action, { select, call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      })
      const typeList = yield select(state => state.areaManage.typeList)
      const ret = yield call(getArea, action.payload)
      const getTypeName = (e) => {
        e.typeName = getText(e.type, typeList, 'name')
        if (e.children) {
          e.children.forEach((v) => {
            getTypeName(v)
          })
        }
      }
      if (ret.code === 'S000000') {
        ret.data.forEach((e) => {
          getTypeName(e)
        })
        yield put({
          type: 'setAreaList',
          payload: {
            data: ret.data,
          },
        })
        yield put({
          type: 'setLoading',
          payload: false,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * deleteArea (action, { select, call, put }) {
      const ret = yield call(deleteArea, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'getAreaList',
          payload: {

          },
        })
        message.success('删除区域成功！')
      } else {
        message.warning(ret.message)
      }
    },
    * addArea (action, { select, call, put }) {
      const ret = yield call(addArea, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'getAreaList',
          payload: {

          },
        })
        yield put({
          type: 'setTabKeys',
          payload: {
            tabKeys: '1',
            tabText: '新增',
            parentId: '',
            type: 'add',
          },
        })
        message.success('新增区域成功！')
      } else {
        message.warning(ret.message)
      }
    },
    * updateArea (action, { select, call, put }) {
      const ret = yield call(updateArea, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'getAreaList',
          payload: {

          },
        })
        yield put({
          type: 'setTabKeys',
          payload: {
            tabKeys: '1',
            tabText: '新增',
            parentId: '',
            type: 'add',
          },
        })
        message.success('编辑区域成功！')
      } else {
        message.warning(ret.message)
      }
    },
    * getParentAreas (action, { select, call, put }) {
      const ret = yield call(getParentAreas, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setParentAreas',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
  },
  reducers: {
    setTabKeys (state, { payload }) {
      return { ...state, ...payload }
    },
    setAreaList (state, { payload }) {
      return { ...state, AreList: [...payload.data] }
    },
    setParentAreas (state, { payload }) {
      return { ...state, ParentAreas: [...payload.data] }
    },
    setModifyArea (state, { payload }) {
      return { ...state, ...payload }
    },
    setLoading (state, { payload }) {
      return { ...state, isLoading: payload }
    },
  },
}
