import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/newModel'
import { userInviteCommissionPage, userInviteCommissionExport, productShowcaseList, importClose, importUnClose} from '../../services'

export default modelExtend(
  filterModel({ reqFn: userInviteCommissionPage, namespace: 'commission',downloadFn : userInviteCommissionExport}),
{
  namespace: 'commission',
  state: {
    statusList: [
      {
        id: '1',
        name: '已结佣'
      },
      {
        id: '2',
        name: '待结佣'
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
        if (location.pathname === '/agent/commission') {
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
    * uploadClose ({ payload }, { put, call }) {
      const ret = yield call(importClose, payload)
      const { code } = ret
      if (code === 'S000000') {
         message.success('上传未结列表成功')
         yield put ({
           type: 'getPageList',
           payload: {}
         })
      } else {
        message.warning(ret.message)
      }
    },
    * uploadUnClose ({ payload }, { put, call }) {
      const ret = yield call(importUnClose, payload)
      const { code } = ret
      if (code === 'S000000') {
         message.success('上传已结列表成功')
         yield put ({
           type: 'getPageList',
           payload: {}
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
