/* global window */
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/model'
import { message } from 'antd';
import {
  showProductLists,
  cityList,
  queryList,
  createProduct,
  upDown,
  lgBuildingList,
  tongbu,
  exportUserReserveProject,
  employeesDetail,
  lyProjectName,
  updateHouseShowSwitch,
  updateBfProject,
  deleteBfProject,
  downBfProjectBatch
} from '../services';

export default modelExtend(
  filterModel({ reqFn: queryList, namespace: 'filter'}),
  {
    namespace: 'filter',
    state: {
      status: [{
          id: '1',
          name: '已发布',
        },{
          id: '0',
          name: '已下架',
        }
      ],
      // 城市列表
      cityList: [],
      // 商品展示名称列表
      showProductList: [],
      // 蓝光在线楼盘列表
      lgBuildingList: [],
      lyProjectList:[],
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/productList') {
            dispatch({
              type: 'getPageList',
              payload: {},
            });
            // 请求城市列表
            dispatch({
              type: 'getCityList',
              payload: {},
            });
            // 请求商品展示名称
            dispatch({
              type: 'getShowProduct',
              payload: {},
            });
            dispatch({
              type: 'getlyProjectList',
              payload: {},
            });
            dispatch({
              type: 'getBuildingList',
              payload: {},
            });
          }
        });
      },
    },

    effects: {
       // 请求城市列表
      *getCityList ({ payload }, { put, call, select }) {
        const ret = yield call(cityList, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveCityList',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 请求商品展示名称
      *getShowProduct ({ payload }, { put, call, select }) {
        const ret = yield call(showProductLists, payload);
        const { code,data } = ret
        if (code === 'S000000') {
             var result = [];
             var obj = {};
             for (var i = 0; i < data.length; i++) {
               if (!obj[data[i].bfProjectId]) {
                 result.push(data[i]);
                 obj[data[i].bfProjectId] = true;
               }
             }
          yield put({
            type: 'saveShowProductList',
            payload: {
              data:result
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 创建商品
      *addProduct ({ payload,success }, { put, call, select }) {
        const ret = yield call(createProduct, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'getPageList',
            payload: {
              pageNum: 1,
              pageSize: 10
            },
          })
          yield put({
            type: 'getShowProduct',
            payload: {},
          })
          success && success()
          yield put({
            type: 'saveOnchangePage',
            payload: 1
          })
          message.success('新建成功')
        } else {
          message.warning(ret.message)
          message.warning(ret.message)
        }
      },
      
      //批量下架
      *getdownBfProjectBatch ({ payload,success }, { put, call, select }) {
        let that = this
        const ret = yield call(downBfProjectBatch, payload);
        const changePage = yield select(state => state.filter.changePage)
        const { code } = ret
       
        if (code === 'S000000') {
          // payload.status == 1 ? message.success('发布成功') : message.success('下架成功')
          // payload = []
          message.success('下架成功')
          success && success()
          yield put({
            type: 'getPageList',
            payload: {
              pageNum: changePage,
              pageSize: 10
            },
          })
          
        } else {
          message.warning(ret.message)
        }
      },
      // 发布下架
      *downUp ({ payload,success }, { put, call, select }) {
        const ret = yield call(upDown, payload);
        const changePage = yield select(state => state.filter.changePage)
        const { code } = ret
        if (code === 'S000000') {
          payload.status == 1 ? message.success('发布成功') : message.success('下架成功')
          success && success()
          if (!success) {
              yield put({
                type: 'getPageList',
                payload: {
                  pageNum: changePage,
                  pageSize: 10
                },
              })
          } 
        } else {
          message.warning(ret.message)
        }
      },
      // 展示隐藏
      *showSwitch ({ payload ,success}, { put, call }) {
        const ret = yield call(updateHouseShowSwitch, payload);
        const { code } = ret
        if (code === 'S000000') {
          payload.switchStatus == 'ON' ? message.success('展示成功') : message.success('隐藏成功')
          success && success()
          if (!success) {
            yield put({
              type: 'getPageList',
              payload: {},
            })
          }
        } else {
          message.warning(ret.message)
        }
      },
      //编辑商品
      *getupdateBfProject ({ payload,success }, { put, call, select }) {
        const changePage = yield select(state => state.filter.changePage)
        const ret = yield call(updateBfProject, payload);
        const { code } = ret
        if (code === 'S000000') {
          message.success('编辑成功')
          // payload.switchStatus == 'ON' ? message.success('') : message.success('修改成功')
          yield put({
            type: 'getPageList',
            payload: {
              pageNum: changePage,
              pageSize: 10
            },
          })
          yield put({
            type: 'getShowProduct',
            payload: {},
          })
          success && success()
        } else {
          message.warning(ret.message)
        }
      },

      //删除商品
      *getdeleteBfProject ({ payload }, { put, call, select }) {
        const ret = yield call(deleteBfProject, payload);
        const changePage = yield select(state => state.filter.changePage)
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
      
           yield put({
            type: 'getPageList',
            payload: {
              pageNum: changePage,
              pageSize: 10
            },
          })
        } else {
          message.warning(ret.message)
        }
      },


      // 蓝光在线楼盘列表
      *getBuildingList ({ payload,success }, { put, call, select }) {
        const ret = yield call(lgBuildingList, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
             type: 'savelgBuildingList',
             payload:{
               data,
             }
          })
         success && success()
        } else {
          message.warning(ret.message)
        }
      },
      // 蓝楼盘列表
      *getlyProjectList ({payload}, { put, call, select }) {
        const ret = yield call(lyProjectName, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
             type: 'savelyProjectList',
             payload:{
               data,
             }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 蓝光在线楼盘列表
      *goUpdate ({ payload }, { put, call}) {
        const ret = yield call(tongbu, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          message.success('同步成功')
        } else {
          message.warning(ret.message)
        }
      },
      // 导出预约看房记录表
      *download ({ payload }, { call }) {
         yield call(exportUserReserveProject, payload);
      },
      // 导出已认证员工记录表
      *downloadEmployeesDetail ({ payload }, { call }) {
         yield call(employeesDetail, payload);
      },
    },
    reducers: {
      // 存储城市列表
      saveCityList (state, { payload }) {
        return {
          ...state,
          cityList: payload.data,
        };
      },
      // 存储商品展示名称
      saveShowProductList (state, { payload }) {
        return {
          ...state,
          showProductList: payload.data,
        };
      },
      // 存储蓝光在线楼盘列表
      savelgBuildingList (state, { payload }) {
        return {
          ...state,
          lgBuildingList: payload.data,
        };
      },
      // 存蓝裔楼盘列表
      savelyProjectList (state, { payload }) {
        return {
          ...state,
          lyProjectList: payload.data,
        };
      },
    },
  }
);
