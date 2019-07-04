import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/newModel'
import { userInviteDealPage, userInviteDealExport, productShowcaseList} from '../../services'

export default modelExtend(
  filterModel({ reqFn: userInviteDealPage, namespace: 'success',downloadFn : userInviteDealExport}),
{
  namespace: 'success',
  state: {
    statusList: [
      {
        id: '1',
        name: '报备成功'
      }, {
        id: '2',
        name: '已到访'
      }, {
        id: '3',
        name: '已认筹'
      }, {
        id: '4',
        name: '已认购'
      }, {
        id: '5',
        name: '已签约'
      }, {
        id: '6',
        name: '已失效'
      }, {
        id: '7',
        name: '分配置业顾问'
      }, {
        id: '0',
        name: '推介失败'
      },
    ],
    projectList : []
  },
  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      history.listen(location => {
        if (location.pathname === '/agent/success') {
          dispatch({
            type: 'getPageList',
            payload: {},
          })
          dispatch({
            type: 'getProjectList',
            payload: {},
          })
        }
      });
    },
  },
  
  effects: {// action 执行函数
    * getProjectList ({ payload }, { put, call }) {
      const ret = yield call(productShowcaseList, payload)
      const { code, data } = ret
      if (code === 'S000000') {
         yield put ({
           type : 'saveProjectList',
           payload: {
             data,
           }
         })
      } else {
        message.warning(ret.message)
      }
    },
   
  },
  reducers: {
    saveProjectList (state, { payload }) {
      return {
        ...state,
        projectList: payload.data,
      }
    },
    
  },
}
)
