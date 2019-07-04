/* global window */
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/model'
import { message } from 'antd';
import {
  queryList,
  addOrUpdateSupplier,
   pullList,
   deleteSupplier
} from '../services';

export default modelExtend(
  filterModel({ reqFn: queryList, namespace: 'supplier'}),
  {
    namespace: 'supplier',
    state: {
      supplierName: '',
      pullList: []
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/supplier') {
            dispatch({
              type: 'getPageList',
              payload: {},
            })
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
      *editSupplier ({ payload, success }, { put, call, select }) {
        const ret = yield call(addOrUpdateSupplier, payload.data)
        const changePage = yield select(state => state.supplier.changePage)        
        const { code } = ret
        if (code === 'S000000') {
          message.success('操作成功')
          success()
         if (payload.type === 'create') {
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
        const ret = yield call(pullList, payload)
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
        const ret = yield call(deleteSupplier, payload)
        const changePage = yield select(state => state.supplier.changePage)
        const { code, data } = ret
        if (code === 'S000000') {
           message.success('删除成功')
           yield put({
             type: 'getPageList',
             payload: {
               pageNum: changePage,
               pageSize: 10
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
      // test
      saveEdit (state, { payload }) {
        return {
          ...state,
          supplierName: payload.data,
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
