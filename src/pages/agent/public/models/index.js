import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/newModel'
import { userPageList, userExport } from '../../services'

export default modelExtend(
  filterModel({ reqFn: userPageList, namespace: 'publicModel',downloadFn : userExport}),
{
  namespace: 'publicModel',
  state: {
    isBindingList : [
      {
        id : 1,
        name: '未绑定'
      },
      {
        id: 2,
        name: '已绑定'
      }
    ]
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/agent/public') {
          dispatch({
            type: 'getPageList',
            payload: {},
          })
        }
      });
    },
  },
  reducers: {
    getDetail (state, { payload }) {
      return {
        ...state,
        detail: payload,
      }
    },
    
  },
  effects: {// action 执行函数
    // * couponDetail ({ payload }, { put, call }) {
    //   const ret = yield call('', payload)
    //   if (ret.code === 'S000000') {
      
     
    //   } else {
    //     message.warning(ret.message)
    //   }
    // },
   
  },
}
)
