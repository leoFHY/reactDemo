import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import {
  getUserList,
  getUserImport,
  getUserExport,
  getDelUser,
  getTree, getRoleList, getAddUser, company, getBuildList, getEditUser, getUserDetail, mediaList, dictList,
  getProjectList,
}
  from './service'

export default {
  namespace: 'userManagement',
  state: {

    tabKeys: '1',
    tabText: '新增',
    isreload: false,
    /* 添加用户state */
    roleList: [],
    confirmDirty: false,
    /*  获取归属公司列表  */
    companyList: [],
    /* 用户ID */
    userDetail: {},
    /* 机构树 */
    treeList: [],
    /* 选中的树节点ID */
    treeId: '',
    /* 用户列表 */
    userList: {
      pageNum: '1',
      pageSize: '10',
      list: [],
    },
    loading: false,
    companyId: '',
    name: '',
    officeId: '',
    loginName: '',
    /* 获取楼盘列表 */
    buildList: [],
    /* 默认部门id */
    defOfficeId: '',
    mediaList: [],
    dictList: [],
    hasMedia: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/backStageManagement/userManagement').exec(pathname)
        if (match) {
          dispatch({ type: 'getRoleList', payload: {} })
          dispatch({ type: 'getTree', payload: {} })
          // dispatch({ type: 'getCompany', payload: {} })
          // dispatch({ type: 'getMediaList', payload: {} })
          // dispatch({ type: 'getDictList', payload: {} })
          // dispatch({ type: 'getBuildList', payload: {} })
          dispatch({ type: 'projectList', payload: {} })
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
    * getMediaList (action, { call, put }) {
      const ret = yield call(mediaList, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'mediaList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getDictList (action, { call, put }) {
      const ret = yield call(dictList, { type: 'sys_user_type' })
      if (ret.code === 'S000000') {
        yield put({
          type: 'dictList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取组织管理树 */
    * getTree (action, { select, call, put }) {
      yield put({
        type: 'setIsReload',
        payload: {
          data: true,
        },
      })
      const ret = yield call(getTree, action.payload)
      if (ret.code === 'S000000') {
        let defOfficeId
        const aaa = (data) => {
          data.forEach((e) => {
            if (e.type === '2' && !defOfficeId) {
              defOfficeId = e.id
            } else if (e.children) {
              aaa(e.children)
            }
          })
        }
        aaa(ret.data)
        yield put({
          type: 'setTree',
          payload: {
            data: ret.data,
            defOfficeId,
          },
        })
        yield put({
          type: 'setIsReload',
          payload: {
            data: false,
          },
        })
        yield put({
          type: 'getUserList',
          payload: {
            // treeId: ret.data[0].id, defOfficeId
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取用户列表 */
    * getUserList (action, { select, call, put }) {
      yield put({
        type: 'setLoading',
        payload: {
          data: true,
        },
      })
      const name = yield select(state => state.userManagement.name)
      const companyId = yield select(state => state.userManagement.companyId)
      const officeId = yield select(state => state.userManagement.officeId)
      const loginName = yield select(state => state.userManagement.loginName)

      const pageNum = yield select(state => state.userManagement.userList.pageNum)
      const pageSize = yield select(state => state.userManagement.userList.pageSize)
      action.payload = Object.assign({
        pageNum,
        pageSize,
        name,
        companyId,
        officeId,
        loginName,
      }, action.payload)
      const ret = yield call(getUserList, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'setUserList',
          payload: {
            data: ret.data,
            isLoading: false,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取角色列表 */
    * getRoleList (action, { select, call, put }) {
      action.payload.pageNum = '1'
      action.payload.pageSize = '999'
      const ret = yield call(getRoleList, action.payload)
      if (ret.code === 'S000000') {
        const roleList = ret.data.list.map((e) => {
          e.value = e.id
          e.label = e.name
          e.title = e.name
          return e
        })
        yield put({
          type: 'setRoleList',
          payload: {
            data: roleList,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取归属公司列表 */
    * getCompany (action, { select, call, put }) {
      const ret = yield call(company, action.payload)
      if (ret.code === 'S000000') {
        const CompanyList = ret.data.map((e) => {
          e.value = e.id
          e.label = e.name
          e.title = e.name
          return e
        })
        yield put({
          type: 'setCompanyList',
          payload: {
            data: CompanyList,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 获取用户列表详情 */
    * getUserDetail ({payload}, { select, call, put }) {
      const roleList = yield select(state => state.userManagement.roleList)
      yield put({
        type: 'setTabKeys',
        payload: {
          key: '2',
          text: '修改',
        },
      })
      const ret = yield call(getUserDetail, payload)
      // const ret2 = yield call(getProjectList, payload)
      if (ret.code !== 'S000000') {
        message.warning(ret.message)
      }
      // console.log(ret2.data.cheesedProjects)
      if (ret.code === 'S000000') {
        if (ret.data.photo) {
          ret.data.photo = [{
            uid: ret.data.id,
            url: ret.data.photo,
          }]
        }
        // ret.data.projectIds = ret2.data.cheesedProjects.map(v => v.projectId)
        yield put({
          type: 'setUserDetail',
          payload: {
            data: ret.data,
          },
        })
        let hasMedia = false
        for (let index = 0; index < roleList.length; index++) {
          if(ret.data.userRoles && ret.data.userRoles.includes(roleList[index].id) && roleList[index].name === '媒体'){
            hasMedia = true
          }
        }
        yield put({
          type: 'mediaChange',
          payload: hasMedia,
        })
      } else {
        message.warning(ret.message)
      }
    },
    // * getBuildList (action, { select, call, put }) {
    //   const ret = yield call(getBuildList, action.payload)
    //   if (ret.code === 'S000000') {
    //     const BuildList = ret.data.map((e) => {
    //       // e.value = e.value
    //       e.label = e.value
    //       e.title = e.id
    //       e.value = e.id
    //       return e
    //     })
    //     // console.log(BuildList)
    //     yield put({
    //       type: 'setBuildList',
    //       payload: {
    //         data: BuildList,
    //       },
    //     })
    //   } else {
    //     message.warning(ret.message)
    //   }
    // },
    /* 添加用户 */
    * getAddUser (action, { select, call, put }) {
      const ret = yield call(getAddUser, action.payload)
      if (ret.code === 'S000000') {
        message.success('新增用户成功！')
        yield put({
          type: 'setTabKeys',
          payload: {
            key: '1',
            text: '新增',
          },
        })
        yield put({
          type: 'getUserList',
          payload: {
            // treeId: ret.data[0].id, defOfficeId
            pageNum: '1',
            name: '',
            companyId: '',
            officeId: '',
            loginName: '',
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 删除用户 */
    * getDelUser (action, { select, call, put }) {
      const userList = yield select(state => state.userManagement.userList)

      const ret = yield call(getDelUser, action.payload)
      if (ret.code === 'S000000') {
        message.success('删除用户成功！')
        yield put({
          type: 'getUserList',
          payload: {
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    /* 编辑用户 */
    * getEditUser (action, { select, call, put }) { 
      // const name = yield select(state => state.userManagement.name)
      // const companyId = yield select(state => state.userManagement.companyId)
      // const officeId = yield select(state => state.userManagement.officeId)
      // const loginName = yield select(state => state.userManagement.loginName)
      // const pageNum = yield select(state => state.userManagement.userList.pageNum)
      // const pageSize = yield select(state => state.userManagement.userList.pageSize)

      const userDetail = yield select(state => state.userManagement.userDetail)
      action.payload = Object.assign({
        ...userDetail,
      }, action.payload)
      const ret = yield call(getEditUser, action.payload)
      if (ret.code === 'S000000') {
        message.success('编辑用户成功！')
        yield put({
          type: 'setTabKeys',
          payload: {
            key: '1',
            text: '新增',
          },
        })
        // yield put({
        //   type: 'getUserList',
        //   payload: {
        //     pageNum,
        //     pageSize,
        //     name,
        //     companyId,
        //     officeId,
        //     loginName,
        //   },
        // })
      } else {
        message.warning(ret.message)
      }
    },
    /* 导入用户列表 */
    * getUserImport (action, { select, call, put }) {
      const ret = yield call(getUserImport, action.payload)
      // message.warning(ret.message)
    },
    /* 导出用户列表 */
    * getUserExport (action, { select, call, put }) {
      const ret = yield call(getUserExport, action.payload)
      // message.warning(ret.message)
    },
    * projectList (action, { select, call, put }) {
      const ret = yield call(getProjectList, action.payload)
      if (ret.code === 'S000000') {
        const b = (e) => {
          ret.data.map((item) => {
            if (item.id === e.parentId) {
              if (!item.children) {
                item.children = []
              }
              item.children.push(e)
            } else {
              // b(item.id)
            }
          })
        }
        let data = ret.data.map((item) => {
          if (item.parentId === -1 ) {
            item.children = []
          } else {
            b(item)
            item = null
          }
          return item
        })
        data = ret.data.filter((item) => {
          return item.parentId === -1
        })
        
        yield put({
          type: 'setBuildList',
          payload: {
            data: [...data],
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
  },
  reducers: {
    dictList (state, { payload }) {
      return { ...state, dictList: payload.list }
    },
    mediaList (state, { payload }) {
      return { ...state, mediaList: payload }
    },
    mediaChange (state, { payload }) {
      return { ...state, hasMedia: payload }
    },
    /* 切换tab */
    setTabKeys (state, { payload }) {
      return { ...state, tabKeys: payload.key, tabText: payload.text }
    },
    /* 刷新树 */
    setIsReload (state, { payload }) {
      return { ...state, isreload: payload.data }
    },
    /* 树 */
    setTree (state, { payload }) {
      return { ...state, treeList: [...payload.data], defOfficeId: payload.defOfficeId }
    },
    /* 用户列表 */
    setUserList (state, { payload }) {
      return { ...state, userList: { ...payload.data }, loading: payload.isLoading }
    },
    /* 搜索数据 */
    setSearch (state, { payload }) {
      return { ...state, ...payload }
    },
    /* 树节点ID  */
    setTreeID (state, { payload }) {
      return { ...state, treeId: payload.treeId }
    },
    /* 角色列表 */
    setRoleList (state, { payload }) {
      return { ...state, roleList: payload.data }
    },
    /* 获取归属公司列表 */
    setCompanyList (state, { payload }) {
      return { ...state, companyList: payload.data }
    },
    setBuildList (state, { payload }) {
      return { ...state, buildList: payload.data }
    },
    /*  */
    setUserDetail (state, { payload }) {
      return { ...state, userDetail: payload.data }
    },
    setLoading (state, { payload }) {
      return { ...state, loading: payload.data }
    },
  },
}
