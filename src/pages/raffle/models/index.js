/* global window */
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/model'
import { message } from 'antd';
import {
  queryList,
  prizeList,
  addOrUpdatePrize,
  prizeDetail,
  deletePrize,
  prizeRuleDetail,
  addOrUpdateRulePrize
} from '../service';
import { deepCopy } from 'utils/copy'
import moment from 'moment';
import { isArray } from 'util';
export default modelExtend(
  filterModel({ reqFn: queryList, namespace: 'raffle'}),
  {
    namespace: 'raffle',
    state: {
      pullList: [],
      // 保存图片
      listImg1: [],
      // 保存图片
      listImg2: [],
      // 暂存列表数据
      editList: {},
      previewShow: false,
      previewSrc: '',
      // 抽奖规则多图
      listImg3: [],
      datailData: {},
      prizeTypeList: [{
        id:'1',
        name: '现实'
      },{
        id:'2',
        name: '虚拟'
      }]
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/raffle') {
            dispatch({
              type: 'getPageList',
              payload: {},
            })
            dispatch({
              type: 'getPullList',
              payload: {},
            })
            dispatch({
              type: 'getPrizeRuleDetail',
              payload: {},
            })
          }
        });
      },
    },

    effects: {
      // 下拉列表
      *getPullList ({ payload }, { put, call }) {
        const ret = yield call(prizeList, payload);
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
      // 更新抽奖
      *updateRaffle ({ payload, success }, { put, call, select }) {
        const ret = yield call(addOrUpdatePrize, payload.data)
        const changePage = yield select(state => state.raffle.changePage)
        const { code } = ret
        if (code === 'S000000') {
          message.success('操作成功')
          success && success()
           if (payload.type === 'create') {
             yield put({
               type: 'getPageList',
               payload: {
                 pageNum: 1,
                 pageSize: 10
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
                 pageSize: 10
               },
             })
           }
        } else {
          message.warning(ret.message)
        }
      },
      // 保存编辑回显
      *saveEdit ({ payload }, { put, call }) {
        const ret = yield call(prizeDetail, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveEditList',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 删除
      *onDel ({ payload }, { put, call, select }) {
        const ret = yield call(deletePrize, payload);
        const changePage = yield select(state => state.raffle.changePage)
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
          yield put({
            type: 'getPageList',
            payload: {
               pageNum: changePage,
               pageSize: 10
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 抽奖配置更新
      *configurationUpdate ({ payload }, { put, call }) {
        const ret = yield call(addOrUpdateRulePrize, payload);
        const { code } = ret
        if (code === 'S000000') {
          message.success('保存成功')
          yield put({
            type: 'getPrizeRuleDetail',
            payload: {}
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 抽奖规则多图，改变排序
      * changePos ({ payload }, { put, select }) {
          const { listImg3 } = yield select(state => state.raffle)
          let imgsArr = deepCopy(listImg3)
          
          let i = payload.i
          const list = imgsArr.splice(i, 1)
          let item = {}
          if (isArray(list)) {
             item =list[0]
          }
          if (payload.type === 'l') {
            if (i === 0) {
              i = imgsArr.length + 1
            }
            imgsArr.splice(i - 1, 0, item)
          } else {
            if (i === imgsArr.length) {
              i = -1
            }
            imgsArr.splice(i + 1, 0, item)
          }
          yield put({
            type: 'changeRaffleImages',
            payload: {
              data: imgsArr,
            }
          })
        },
        // 奖品配置图片1，改变排序
        * changeSort1 ({ payload }, { put, select }) {
          const { listImg1 } = yield select(state => state.raffle)
          let imgsArr = deepCopy(listImg1)
          
          let i = payload.i
          const list = imgsArr.splice(i, 1)
          let item = {}
          if (isArray(list)) {
             item =list[0]
          }
          if (payload.type === 'l') {
            if (i === 0) {
              i = imgsArr.length + 1
            }
            imgsArr.splice(i - 1, 0, item)
          } else {
            if (i === imgsArr.length) {
              i = -1
            }
            imgsArr.splice(i + 1, 0, item)
          }
          yield put({
            type: 'changeSortImages1',
            payload: {
              data: imgsArr,
            }
          })
        },
        // 奖品配置图片2，改变排序
        * changeSort2 ({ payload }, { put, select }) {
          const { listImg2 } = yield select(state => state.raffle)
          let imgsArr = deepCopy(listImg2)
          
          let i = payload.i
          const list = imgsArr.splice(i, 1)
          let item = {}
          if (isArray(list)) {
             item =list[0]
          }
          if (payload.type === 'l') {
            if (i === 0) {
              i = imgsArr.length + 1
            }
            imgsArr.splice(i - 1, 0, item)
          } else {
            if (i === imgsArr.length) {
              i = -1
            }
            imgsArr.splice(i + 1, 0, item)
          }
          yield put({
            type: 'changeSortImages2',
            payload: {
              data: imgsArr,
            }
          })
        },
      *getPrizeRuleDetail ({ payload }, { put, call }) {
        const ret = yield call(prizeRuleDetail, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          let list = deepCopy(data)
          if (data.startDate) {
            list.time = [moment(data.startDate), moment(data.endDate)]
          } else {
            list.time = []
          }
          yield put({
            type: 'savePrizeRuleDetail',
            payload: {
              data: list
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 抽奖规则多图，删除
      *removeImg ({ payload }, { put,select }) {
        const { listImg3 } = yield select(state => state.raffle)
        let list = deepCopy(listImg3)
        list.splice(payload, 1)
         yield put({
           type: 'changeRaffleImages',
           payload: {
             data: list,
           }
         })
      },
      // 奖品配置图片1 删除
      *removeImg1 ({ payload }, { put,select }) {
        const { listImg1 } = yield select(state => state.raffle)
        let list = deepCopy(listImg1)
        list.splice(payload, 1)
         yield put({
           type: 'changeSortImages1',
           payload: {
             data: list,
           }
         })
      },
      // 奖品配置图片1 删除
      *removeImg2 ({ payload }, { put,select }) {
        const { listImg2 } = yield select(state => state.raffle)
        let list = deepCopy(listImg2)
        list.splice(payload, 1)
         yield put({
           type: 'changeSortImages2',
           payload: {
             data: list,
           }
         })
      }

    },
    reducers: {
      
      savePullList (state, { payload }) {
        return {
          ...state,
          pullList: payload.data,
        };
      },
      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      // 保存图片1
      saveMediaImages1 (state, { payload }) {
        return {
          ...state,
          listImg1: state.listImg1.concat(payload.data), 
        };
      },
      // 保存图片1
      saveMediaImages2 (state, { payload }) {
        return {
          ...state,
          listImg2: state.listImg2.concat(payload.data), 
        };
      },
      // 保存编辑回显
      saveEditList (state, { payload }) {
        return {
          ...state,
          editList: payload.data,
          listImg1: payload.data.prizePic1List,
          listImg2: payload.data.prizePic2List,
        };
      },
      // 保存抽奖规则多图
      saveRaffleImages (state, { payload }) {
        return {
          ...state,
          listImg3: state.listImg3.concat(payload.data),
        };
      },
      // 改变抽奖规则多图顺序
      changeRaffleImages (state, { payload }) {
        return {
          ...state,
          listImg3: payload.data,
        };
      },
      //  抽奖规则详情
      savePrizeRuleDetail (state, { payload }) {
        return {
          ...state,
          datailData: payload.data,
          listImg3: payload.data.picList
        };
      },
      // 奖品配置图片1
      changeSortImages1(state, {
        payload
      }) {
        return {
          ...state,
          listImg1: payload.data,
        };
      },
      // 奖品配置图片2
      changeSortImages2(state, {
        payload
      }) {
        return {
          ...state,
          listImg2: payload.data,
        };
      },

    } 
  });
