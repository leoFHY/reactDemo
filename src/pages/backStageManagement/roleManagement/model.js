import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import {
  addRoleSubmit,
  uploadRoleSubmit,
  getRoleDetail,
  delRol,
  getRoleList,
  getRoleTree, getTree, getUserByRole, getUserById, addRoleUser,
} from './service'

export default {
  namespace: 'roleManagement',
  state: {
    roleList: {
      pageNum: '1',
      pageSize: '10',
    },
    roleInput: {},
    loading: true,
    /* 角色详情 */
    roleDetail: {},
    /* 角色授权 */
    roleTree: [],
    /* 机构树 */
    treeList: [],

    tabKeys: '1',
    tabText: '新增',
    /* 获取角色下用户 */
    userByRoleList: [],
    /* 选中的角色 */
    selectRole: {},
    user: [],
    selectUserByRoleList: [],
    AddRoles: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/backStageManagement/roleManagement').exec(pathname)
        if (match) {
          dispatch({ type: 'getRoleList', payload: {} })
          dispatch({ type: 'getRoleTree', payload: {} })
          dispatch({ type: 'getTree', payload: {} })

          dispatch({
            type: 'setTabKeys',
            payload: {
              key: '1',
              text: '新增',
            },
          })
        }
      })
    },
  },
  effects: {
    * getRoleList (action, { select, call, put }) {
      yield put({
        type: 'setLoading',
        payload: {
          data: true,
        },
      })
      const pageNum = yield select(state => state.roleManagement.roleList.pageNum)
      const pageSize = yield select(state => state.roleManagement.roleList.pageSize)
      action.payload = Object.assign({
        pageNum,
        pageSize,
      }, action.payload)
      const ret = yield call(getRoleList, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setRoleList',
          payload: {
            data: ret.data,
            isLoading: false,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getRoleTree (action, { call, put }) {
      const ret = yield call(getRoleTree, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setRoleTree',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取组织管理树 */
    * getTree (action, { select, call, put }) {
      const ret = yield call(getTree, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setTree',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * addRoleSubmit (action, { call, put }) {
      const ret = yield call(addRoleSubmit, action.payload)
      if (ret.code === 'S000000') {
        /* yield put({
          type: '',
          payload: {
            data: ret.data,
          },
        }) */
        message.success('添加成功！')
        yield put({
          type: 'setTabKeys',
          payload: {
            key: '1',
            text: '新增',
            userID: '',
          },
        })
        yield put({
          type: 'getRoleList',
          payload: {
            pageNum: '1',
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * uploadRoleSubmit (action, { call, put }) {
      const ret = yield call(addRoleSubmit, action.payload)
      if (ret.code === 'S000000') {
        /* yield put({
          type: 'updateVipDetailState',
          payload: {
            data: ret.data,
          },
        }) */
        message.success('修改角色信息成功！')
        yield put({
          type: 'setTabKeys',
          payload: {
            key: '1',
            text: '新增',
            userID: '',
          },
        })
        yield put({
          type: 'getRoleList',
          payload: {
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getRoleInput (action, { call, put }) {
      /* const ret = yield call(getRoleDetail, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'updateVipDetailState',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      } */
    },
    * getRoleDetail (action, { call, put }) {
      yield put({
        type: 'setTabKeys',
        payload: {
          key: '2',
          text: '修改',
        },
      })
      const ret = yield call(getRoleDetail, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setRoleDetail',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getUserByRole (action, { call, put }) {
      action.payload.pageNum = '1'
      action.payload.pageSize = '999'
      const ret = yield call(getUserByRole, action.payload)
      yield put({
        type: 'setTabKeys',
        payload: {
          key: '2',
          text: '分配',
        },
      })
      if (ret.code === 'S000000') {
        yield put({
          type: 'setUserByRole',
          payload: {
            data: ret.data || { list: [] },
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getUserById (action, { call, put }) {
      const ret = yield call(getUserById, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setUser',
          payload: {
            data: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * delRol (action, { call, put }) {
      const ret = yield call(delRol, action.payload)
      if (ret.code === 'S000000') {
        message.success('删除角色成功！')
        yield put({
          type: 'getRoleList',
          payload: {
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * addRoleUser (action, { select, call, put }) {
      const ret = yield call(addRoleUser, action.payload)
      if (ret.code === 'S000000') {
        /* yield put({
          type: 'updateVipDetailState',
          payload: {
            data: ret.data,
          },
        }) */
        const roleId = yield select(state => state.roleManagement.selectRole.id)
        let text = ''
        switch (action.payload.type) {
        case 'add':
          text = '新增'
          break
        case 'remove':
          text = '清除'
          break
        case 'delete':
          text = '删除'
          break
        default:
          text = '新增'
          break
        }
        yield put({
          type: 'getUserByRole',
          payload: {
            roleId,
          },
        })
        message.success(`${text}成员成功！`)
      } else {
        message.warning(ret.message)
      }
    },
  },
  reducers: {
    /* 切换tab */
    setTabKeys (state, { payload }) {
      return { ...state, tabKeys: payload.key, tabText: payload.text }
    },
    /* 角色列表 */
    setRoleList (state, { payload }) {
      return { ...state, roleList: { ...payload.data }, loading: payload.isLoading }
    },
    /* 角色详情 */
    setRoleDetail (state, { payload }) {
      return { ...state, roleDetail: payload.data }
    },
    /* 角色授权树 */
    setRoleTree (state, { payload }) {
      return { ...state, roleTree: payload.data }
    },
    /* 树 */
    setTree (state, { payload }) {
      return { ...state, treeList: [...payload.data] }
    },
    /* 获取角色下用户 */
    setUserByRole (state, { payload }) {
      return { ...state, userByRoleList: [...payload.data.list], selectUserByRoleList: payload.data.list }
    },
    setSelectRole (state, { payload }) {
      return { ...state, selectRole: { ...payload.text } }
    },
    setUser (state, { payload }) {
      return { ...state, user: [...payload.data.list] }
    },
    setSelectUserList (state, { payload }) {
      return { ...state, selectUserByRoleList: [...payload.userList] }
    },
    setLoading (state, { payload }) {
      return { ...state, loading: payload.data }
    },
  },
}
