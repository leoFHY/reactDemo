/* global window */

import { message } from 'antd';

import {
  selectBfProjectCommission,
  updateBfProjectCommission,
  deleteBfProjectCommission
}
from '../services/commission'

export default {
    namespace: 'commission',
    state: {
      commissionInfo: '',
      commissionTitle: ''
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen(location => {
       
        // });
      },
    },

    effects: {
     
       // 新增/修改优惠活动
      *getInfo ({ payload }, { put, call }) {
        const ret = yield call(selectBfProjectCommission, payload)
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveInfo',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      *pushInfo ({ payload }, { call }) {
        const ret = yield call(updateBfProjectCommission, payload)
        const { code } = ret
        if (code === 'S000000') {
          message.success('保存成功')
        } else {
          message.warning(ret.message)
        }
      }, 
      *getDel ({ payload, success }, { call }) {
        const ret = yield call(deleteBfProjectCommission, payload)
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
          success && success()
        } else {
          message.warning(ret.message)
        }
      }, 
    },
    reducers: {
      saveInfo (state, { payload }) {
        return {
          ...state,
          ...payload.data,
        };
      },
    //   saveTitle (state, { payload }) {
    //     return {
    //       ...state,
    //       titleData: payload.data.titleData,
    //     };
    //   },
    } 
  };
