/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
// import api from 'api'
import { filterModel } from 'utils/model'
import { message } from 'antd';
import {
  queryList,
  addOrUpdateChannel,
  pullList,
  deleteChannel
} from '../services';

export default modelExtend(
  filterModel({ reqFn: queryList, namespace: 'channel'}),
  {
    namespace: 'channel',
    state: {
      channelName: '',
      pullList: []
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/channel') {
            dispatch({
              type: 'getPageList',
              payload: {},
            });
            dispatch({
              type: 'getPullList',
              payload: {},
            });
          }
        });
      },
    },

    effects: {
       // 请求城市列表
      *editChannel ({ payload, success }, { put, call, select }) {
        const ret = yield call(addOrUpdateChannel, payload.data);
        const changePage = yield select(state => state.channel.changePage)
        const { code } = ret
        if (code === 'S000000') {
          message.success('操作成功')
          success()
          if (payload.type === 'create'){
            yield put({
              type: 'getPageList',
              payload: {
                pageNum: 1,
              },
            })
            yield put({
              type: 'saveOnchangePage',
              payload: 1
            })
          } else {
            yield put({
              type: 'getPageList',
              payload: {
                pageNum: changePage,
              },
            })
          }
          
          yield put({
            type: 'getPullList',
            payload: {},
          });
        } else {
          message.warning(ret.message)
        }
      },
      // 下拉列表
      *getPullList ({ payload }, { put, call, select }) {
        const ret = yield call(pullList, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'savePullList',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      *del ({ payload }, { put, call, select }) {
        const ret = yield call(deleteChannel, payload);
        const changePage = yield select(state => state.channel.changePage)
        const { code, data } = ret
        if (code === 'S000000') {
           message.success('删除成功')
           yield put({
             type: 'getPageList',
             payload: {
                pageNum: changePage,
             }
           })
           yield put({
             type: 'getPullList',
             payload: {},
           });
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      saveRecord (state, { payload }) {
        return {
          ...state,
          channelName: payload.data,
        };
      },
      savePullList (state, { payload }) {
        return {
          ...state,
          pullList: payload.data,
        };
      },
    }
  });
