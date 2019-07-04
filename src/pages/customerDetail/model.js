/* global window */
// import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/model'
import {
  getList,
  exportExcel
} from './service'

export default modelExtend (
  filterModel({ reqFn: getList, namespace: 'customerDetail'}),{
    namespace: 'customerDetail',
    state: {

    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/customerDetail') {
            dispatch({
              type: 'getPageList',
              payload: {
                 pageNum: 1,
                 pageSize: 10
              },
            });
            
          }
        });
      },
    },

    effects: {
       // 查询 列表
      // *getPageList ({ payload }, { put, call }) {
      //   const ret = yield call(getList, payload);
      //   const { code, data } = ret
      //   if (code === 'S000000') {
      //     yield put ({
      //       type: 'saveList',
      //       payload: {
      //         data
      //       },
      //     })
      //   } else {
      //     message.warning(ret.message)
      //   }
      // },
      *export ({ payload }, { put, call }) {
         yield call(exportExcel, payload)
      },
    },
    reducers: {
      // 保存列表数据
      saveList (state, { payload }) {
        return {
          ...state,
          dataSource: payload.data.list,
        };
      },
   
    } 
  });
