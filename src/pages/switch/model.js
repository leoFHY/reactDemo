import { message } from 'antd';
import { pathMatchRegexp } from 'utils'

import {
  switchList,
  updateSwitchStatus
} from './services';


export default {
  namespace: 'switchOn',
  state: {
    switchList: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/switch', pathname)
        ) {
          dispatch({ type: 'getSwitchList' })
         
        }
      })
    },
  },
  effects: {
    // 获取开关列表
    *getSwitchList ({}, { put, call }) {
        const ret = yield call(switchList, {});
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveSwitchList',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      }, 
     // 编辑状态
    *edit ({payload, success}, { put, call }) {
        const ret = yield call(updateSwitchStatus, payload);
        const { code } = ret
        if (code === 'S000000') {
           yield put({
             type: 'getSwitchList',
           })
           success && success()
           message.success('修改状态成功')
        } else {
           message.warning(ret.message)
        }
      }, 
  },
  reducers: {
    // 保存开关列表
    saveSwitchList (state, { payload }) {
      return {
        ...state,
        switchList: payload.data,
      };
    },
    

  },
}
