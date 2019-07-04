/* global window */
import modelExtend from 'dva-model-extend'
import { filterModelNoPage } from 'utils/model'
import { message } from 'antd';
import {
  queryList,
  update,
  quertNameList,
  updateNameList,
  deleteRecommend,
} from '../services';

export default modelExtend(
  filterModelNoPage({ reqFn: queryList, namespace: 'recommend'}),
  {
    namespace: 'recommend',
    state: {
      // 商品名称列表
      goodsList: [],
      // 更新商品名称列表
      updateGoodsList: [],
      listDat: {},
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/defaultRecommend') {
            dispatch({
              type: 'getPageList',
              payload: {},
            });
            dispatch({
              type: 'getQuertName',
              payload: {},
            });
            dispatch({
              type: 'getUpdateGoods',
              payload: {},
            });
          }
        });
      },
    },

    effects: {
       // 请求城市列表
      *editRecommend ({ payload, success }, { put, call, select }) {
        const ret = yield call(update, payload);
        const { code } = ret
        if (code === 'S000000') {
          message.success('操作成功')
          success()
          yield put ({
            type: 'getPageList',
            payload: {},
          })
          yield put({
            type: 'getQuertName',
            payload: {},
          })
          yield put({
            type: 'getUpdateGoods',
            payload: {},
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 查询 商品名称列表
      *getQuertName ({ payload }, { put, call }) {
        const ret = yield call(quertNameList, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put ({
            type: 'saveQuertName',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 查询 更新商品名称列表
      *getUpdateGoods ({ payload }, { put, call }) {
        const ret = yield call(updateNameList, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put ({
            type: 'saveUpdateGoods',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
       *del ({ payload }, { put, call, select }) {
        const ret = yield call(deleteRecommend, payload);
        const { code, data } = ret
        if (code === 'S000000') {
           message.success('删除成功')
           yield put({
             type: 'getPageList',
             payload: {},
           })
           yield put({
             type: 'getQuertName',
             payload: {},
           })
           yield put({
             type: 'getUpdateGoods',
             payload: {},
           })
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      // 保存商品名称
      saveQuertName (state, { payload }) {
        return {
          ...state,
          goodsList: payload.data,
        };
      },
      saveUpdateGoods (state, { payload }) {
        return {
          ...state,
          updateGoodsList: payload.data,
        };
      },
      saveList (state, { payload }) {
        return {
          ...state,
          listDat: payload,
        };
      },
    } 
  });
