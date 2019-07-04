import { message } from 'antd'
import { list, add, detail, deletes, updateMenu, updateSort } from './service'

const showList = [
  { id: '1', name: '显示' },
  { id: '0', name: '隐藏' },
]

export default {
  namespace: 'menuManagement',
  state: {
    loading: false,
    imgMaxSize: 200,
    pageList: [{ children: [] }],
    pageListTree: [],
    sortData: [],
    activeKey: '1',
    activeTxt: '菜单添加',
    treeData: [],
    loadDefaultValue: true,
    /* detailData: {
      icon: [{ url: '' }],
    }, */
    detailData: {},
    showList,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/backStageManagement/menuManagement') {
          
          dispatch({
            type: 'getList',
            payload: {},
          })
          dispatch({ type: 'clearSortChange', payload: {} })
        } else if (location.pathname === '/backStageManagement/menuManagement/add') {
          const { item, menuId, parentId } = location.query
          dispatch({
            type: 'detail',
            payload: {
              item,
              menuId,
              parentId,
            },
          })
        }
      })
    },
  },
  effects: {
    * getList (action, { put, call, select }) {
      let loadDefaultValue = yield select(state => state.menuManagement.loadDefaultValue)
      if (loadDefaultValue) {
        yield put({
          type: 'loadDefaultValue',
          payload: {},
        })
      }
      const ret = yield call(list)
      let pageList = ret.data 
      if (ret.code === 'S000000') {
        yield put({
          type: 'pageList',
          payload: {
            pageList,
          },
        })
      } else {
        message.error(ret.message)
      }
    },
    * detail ({ payload }, { put, call }) {
      const { item, menuId, parentId } = payload
      let activeKey = ''
      let activeTxt = ''
      let detailData = {}
      if (item === 'tabAdd') { // 点击头部添加
        // detailData = { icon: [{ url: '' }] }
        detailData = { }
        activeKey = '2'
        activeTxt = '菜单添加'
      } else if (item === 'listAdd') { // 点击列表页添加
        // detailData = { parentId, icon: [{ url: '' }] }
        detailData = { parentId }
        activeKey = '2'
        activeTxt = '菜单添加'
      } else if (item === 'update') { // 修改
        const ret = yield call(detail, { menuId })
        activeKey = '2'
        activeTxt = '菜单修改'
        if (ret.code === 'S000000') {
          detailData = ret.data
          detailData.typeItem = 'update'
          /* if (detailData.icon) {
            detailData.icon = [{
              url: detailData.icon,
              uid: detailData.icon,
              status: 'done',
            }]
          } else {
            detailData.icon = [{
              url: '',
            }]
          } */
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
    * deletes ({ payload, backIndex }, { call }) {
      const ret = yield call(deletes, payload)
      if (ret.code === 'S000000') {
        message.success('删除成功')
        if (backIndex) {
          backIndex()
        }
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
    * updateMenu ({ payload, backIndex }, { call }) {
      const ret = yield call(updateMenu, payload)
      if (ret.code === 'S000000') {
        message.success('修改成功')
        if (backIndex) {
          backIndex()
        }
      } else {
        message.error(ret.message)
      }
    },
    * updateSort ({ payload, backIndex }, { call }) {
      const sortData = payload.sortData
      const ret = yield call(updateSort, sortData)
      if (ret.code === 'S000000') {
        message.success('保存排序成功')
        if (backIndex) {
          // backIndex()
        }
      } else {
        message.error(ret.message)
      }
    },
  },
  reducers: {
    pageList (state, { payload }) {
      // let pageListTree = formatPageList(payload.pageList)
      return {
        ...state,
        loadDefaultValue: true,
        pageList: payload.pageList,
        // pageListTree: payload.pageList,
      }
    },
    sortChange (state, { payload }) {
      let sortData = state.sortData
      let hasId = false
      let o = {
        id: payload.id,
        sort: payload.value || '',
      }
      sortData.forEach((v) => {
        if (v.id === o.id) {
          v.sort = o.sort
          hasId = true
        }
      })
      if (hasId === false) {
        sortData.push(o)
      }
      return {
        ...state,
        sortData,
      }
    },
    clearSortChange (state) {
      return {
        ...state,
        sortData: [],
      }
    },
    detailData (state, { payload }) {
      return {
        ...state,
        loadDefaultValue: false,
        detailData: payload.detailData,
        activeKey: payload.activeKey,
        activeTxt: payload.activeTxt,
      }
    },
    loadDefaultValue (state) {
      return {
        ...state,
        loadDefaultValue: false,
      }
    },
    backIndex (state) {
      return {
        ...state,
        // detailData: { icon: [{ url: '' }] },
        detailData: { },
        activeKey: '1',
        activeTxt: '菜单添加',
      }
    },
  },
}
