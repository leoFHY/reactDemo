import { message } from 'antd'
import { routerRedux } from 'dva/router'
import {
  list, add, detail, deletes, treeList, update, treeDataUser, getArea,
} from './service'

const formatUser = (data) => {
  let arr = []
  data.forEach((v, i) => {
    let o = {}
    o.label = v
    o.value = v
    o.key = `${v}${i}`
    o.node = true
    arr.push(o)
  })
  return arr
}

const formatUserList = (data) => {
  let pageListTree = []
  data.forEach((v) => {
    let o = {}
    o.label = v.name
    o.id = v.id
    o.name = v.name
    o.value = v.id
    o.key = v.id
    o.children = []
    // o.users = v.users
    if (v.users && v.users.length) {
      o.children = formatUser(v.users)
    }
    if (v.children && v.children.length) {
      o.children = formatUserList(v.children).concat(o.children)
    }
    pageListTree.push(o)
  })
  return pageListTree
}

const typeList = [
  { id: '1', name: '公司' },
  { id: '2', name: '部门' },
  // { id: '3', name: '小组' },
  // { id: '4', name: '其他' },
]
const gradeList = [
  { id: '1', name: '一级' },
  { id: '2', name: '二级' },
  { id: '3', name: '三级' },
  // { id: '4', name: '四级' },
]
const useableList = [
  { id: '1', name: '是' },
  { id: '0', name: '否' },
]
const fastSectionList = [
  { id: '0', name: '综合部' },
  { id: '1', name: '开发部' },
  { id: '2', name: '人力部' },
]

export default {
  namespace: 'organizationManagement',
  state: {
    loading: false,
    treeDataUserList: [],
    treeList: [],
    isreload: true,
    activeKey: '1',
    activeTxt: '机构添加',
    treeData: [],
    detailData: {},
    pageList: [],
    pageListTree: [],
    treeDataAreaList: [],
    typeList,
    gradeList,
    useableList,
    fastSectionList,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/backStageManagement/organizationManagement') {
          const { officeId = '' } = location.state || {}
          dispatch({
            type: 'getLeftTreeData',
            payload: { officeId },
          })
          if (officeId) {
            dispatch({
              type: 'getList',
              payload: {
                officeId,
              },
            })
          }
        } else if (location.pathname === '/backStageManagement/organizationManagement/add') {
          const { officeId, item, parentId } = location.query
          // dispatch({
          //   type: 'getLeftTreeData',
          //   payload: {},
          // })
          dispatch({
            type: 'detail',
            payload: {
              officeId, item, parentId,
            },
          })
          // dispatch({
          //   type: 'treeDataUser',
          //   payload: {},
          // })
          // dispatch({
          //   type: 'getArea',
          //   payload: {},
          // })
        }
      })
    },
  },
  effects: {
    * treeDataUser (action, { put, call }) {
      const ret = yield call(treeDataUser)
      let treeDataUserList = ret.data
      if (ret.code === 'S000000') {
        yield put({
          type: 'treeDataUserList',
          payload: {
            treeDataUserList,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * getArea (action, { put, call }) {
      const ret = yield call(getArea)
      let treeDataAreaList = ret.data
      if (ret.code === 'S000000') {
        yield put({
          type: 'treeDataAreaList',
          payload: {
            treeDataAreaList,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * getList ({ payload }, { put, call }) {
      const ret = yield call(list, payload)
      let pageList = ret.data
      if (ret.code === 'S000000') {
        yield put({
          type: 'pageList',
          payload: {
            pageList,
            saveOfficeId: payload.officeId,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * getLeftTreeData ({ payload }, { put, call }) {
      yield put({
        type: 'resertIsreload',
        payload: {
        },
      })
      const ret = yield call(treeList)
      if (ret.code === 'S000000') {
        yield put({
          type: 'treeData',
          payload: {
            treeData: ret.data,
            officeId: payload.officeId,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * detail ({ payload }, { put, call }) {
      const { item, officeId, parentId } = payload
      let activeKey = ''
      let activeTxt = ''
      let detailData = {}
      if (item === 'tabAdd') { // 点击头部添加
        detailData = {
          icon: [{ url: '' }],
        }
      } else if (item === 'listAdd') { // 点击列表页添加
        detailData = { parentId, icon: [{ url: '' }] }
      } else if (item === 'update') { // 修改
        const ret = yield call(detail, { officeId })
        // detailData = ret.data
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
          activeKey,
          activeTxt,
        },
      })
    },
    * deletes ({ payload }, { call, select, put }) {
      const ret = yield call(deletes, payload)
      const officeId = yield select(state => state.organizationManagement.saveOfficeId)
      if (ret.code === 'S000000') {
        message.success('删除成功')
        yield put(routerRedux.push({
          pathname: '/backStageManagement/organizationManagement',
          query: {
          },
          state: {
            officeId,
          },
        }))
      } else {
        message.error(ret.message)
      }
    },
    * add ({ payload }, { call, select, put }) {
      const ret = yield call(add, payload)
      const officeId = yield select(state => state.organizationManagement.saveOfficeId)
      if (ret.code === 'S000000') {
        message.success('添加成功')
        yield put(routerRedux.push({
          pathname: '/backStageManagement/organizationManagement',
          query: {
          },
          state: {
            officeId,
          },
        }))
      } else {
        message.error(ret.message)
      }
    },
    * update ({ payload }, { call, select, put }) {
      const ret = yield call(update, payload)
      const officeId = yield select(state => state.organizationManagement.saveOfficeId)
      if (ret.code === 'S000000') {
        message.success('修改成功')
        yield put(routerRedux.push({
          pathname: '/backStageManagement/organizationManagement',
          query: {
          },
          state: {
            officeId,
          },
        }))
      } else {
        message.error(ret.message)
      }
    },
  },
  reducers: {
    detailData (state, { payload }) {
      return {
        ...state,
        detailData: payload.detailData,
      }
    },
    treeDataUserList (state, { payload }) {
      let treeDataUserList2 = formatUserList(payload.treeDataUserList)
      return {
        ...state,
        treeDataUserList: treeDataUserList2,
      }
    },
    treeDataAreaList (state, { payload }) {
      return {
        ...state,
        treeDataAreaList: payload.treeDataAreaList,
      }
    },
    pageList (state, { payload }) {
      return {
        ...state,
        pageList: payload.pageList,
        saveOfficeId: payload.saveOfficeId,
      }
    },
    resertIsreload (state) {
      return {
        ...state,
        isreload: true,
      }
    },
    treeData (state, { payload }) {
      let o = {}
      if (!payload.officeId) {
        o.pageList = payload.treeData
        o.saveOfficeId = ''
      }
      // let treeList2 = formatPageList(payload.treeData)
      return {
        ...state,
        isreload: false,
        treeList: payload.treeData,
        ...o,
      }
    },
  },
}
