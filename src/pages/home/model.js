import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
import { message } from 'antd';
import { pathMatchRegexp } from 'utils'
import { model } from 'utils/model'

import {
  userAdd,
  userDailyLife,
  userDailyRegister,
  userBuy,
  totalUserFour,
  yezhuGongyingLangguangZiran,
  projectBrowse,
  projectCollect,
  totalUserBuy,
  channelUserAdd,
  userDailyVisit,
  userDailyRenchou,
} from './services';
const { queryDashboard, queryWeather } = api

export default modelExtend(model, {
  namespace: 'home',
  state: {
    cardsList: ['总用户数（组）', '认证身份用户数（组）', '总认筹人数（组）', '总认购人数（组）'],
    // 用户新增数据
    userAddData: {},
    // 用户日活
    userDayData: {},
    // 意向客户登记分日数据
    userDailyRegisterData:{},

    userDailyVisitData:{},
    userDailyRenchouData:{},
    // 用户认购数趋势
    userSubscribe: {},
    // 总用户数,总认筹数,总认购数,总认购金额
    totalUserData: [],
    yesterdayAddList:[
      { count: 4558,
        name: "总认购套数（套）",
        todayCount: 0
      },
      { count: 4558,
        name: "总认购金额（万元）",
        todayCount: 0
      },
      { count: 4558,
        name: "总签约套数（套）",
        todayCount: 0
      },
      { count: 4558,
        name: "总签约金额（万元）",
        todayCount: 0
      }
     
    ],
    // 业主/供应商/蓝光员工/自然客户
    fourDetailData:[],
    userType: ['业主／租户／商户', '供应商', '蓝光员工', '手牵手', '自然客户'],
    // 7天楼盘浏览量前十
    projectBrowseData: [],
    // 历史楼盘收藏量前十
    projectCollectData: [],
    // 总认购金额
    totalUserBuyData: {},
    // 用户认购趋势
    userBuyData: {},
    // 各渠道新增用户数
    channelUserAddData: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathMatchRegexp('/home', pathname) ||
          pathMatchRegexp('/', pathname)
        ) {
          dispatch({ type: 'getTotalUser' })
          dispatch({ type: 'getFourDetail' })
          dispatch({ type: 'getUserAdd', })
          dispatch({ type: 'getUserDay' })
          dispatch({ type: 'getProjectBrowse' })
          dispatch({ type: 'getProjectCollect' })
          dispatch({ type: 'getTotalUserBuy' })
          dispatch({ type: 'getChannelUserAdd' })
          dispatch({ type: 'getUserSubscribe' })
        }
      })
    },
  },
  effects: {
    // 获取用户日活
    *getTotalUser ({}, { put, call, select }) {
        const ret = yield call(totalUserFour, {});
        const cardsList = yield select(state => state.home.cardsList)
        const { code, data } = ret
        if (code === 'S000000') {
          data.forEach((v,i) => {
            v.name = cardsList[i]
          })
          yield put({
            type: 'saveTotalUser',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      }, 
    // 获取用户新增数据
    *getUserAdd ({payload}, { put, call }) {
        // console.log(payload)
        const ret = yield call(userAdd,payload.data);
        const { code, data } = ret
        if (code === 'S000000') {
          
          yield put({
            type: 'saveUserAdd',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
    // 获取用户日活
    *getUserDay ({payload}, { put, call }) {
        const ret = yield call(userDailyLife, payload.data);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveUserDay',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },

      // 意向客户登记分日数据
    *getUserDailyRegister ({payload}, { put, call }) {
      const ret = yield call(userDailyRegister, payload.data);
      const { code, data } = ret
      if (code === 'S000000') {
        yield put({
          type: 'saveUserDailyRegister',
          payload: {
            data
          },
        })
      } else {
        message.warning(ret.message)
      }
    },

    //用户到访分日数据
    *getUserDailyVisit ({payload}, { put, call }) {
      const ret = yield call(userDailyVisit, payload.data);
      const { code, data } = ret
      if (code === 'S000000') {
        yield put({
          type: 'saveUserDailyVisit',
          payload: {
            data
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    //用户认筹分日数据
    *getUserDailyRenchou ({payload}, { put, call }) {
      const ret = yield call(userDailyRenchou, payload.data);
      const { code, data } = ret
      if (code === 'S000000') {
        yield put({
          type: 'saveUserDailyRenchou',
          payload: {
            data
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    //用户认购数趋势
    *getUserBuy ({payload}, { put, call }) {
      const ret = yield call(userBuy, payload.data)
      const { code, data } = ret
      if (code === 'S000000') {
        yield put({
          type: 'saveUserBuy',
          payload: {
            data
          },
        })
      } else {
        message.warning(ret.message)
      }
    },  
    // 业主/供应商/蓝光员工/自然客户
    *getFourDetail ({}, { put, call, select }) {
        const ret = yield call(yezhuGongyingLangguangZiran, {});
        const userType = yield select(state => state.home.userType)
        const { code, data } = ret
        if (code === 'S000000') {
           data.forEach((v, i) => {
             v.name = userType[i]
           })
          yield put({
            type: 'saveFourDetail',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 7天楼盘浏览量前十
    *getProjectBrowse ({}, { put, call }) {
        const ret = yield call(projectBrowse, {});
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveProjectBrowse',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
        // 历史楼盘收藏量前十
    *getProjectCollect ({}, { put, call }) {
        const ret = yield call(projectCollect, {});
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveProjectCollect',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
     
      //总认购金额
      *getTotalUserBuy ({}, { put, call }) {
        const ret = yield call(totalUserBuy, {})
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveTotalUserBuy',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },  
      //各渠道新增用户数
      *getChannelUserAdd ({}, { put, call }) {
        const ret = yield call(channelUserAdd, {})
        const { code, data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveChannelUserAdd',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },  
  },
  reducers: {
    // 保存用户新增数据
    saveUserAdd (state, { payload }) {
      return {
        ...state,
        userAddData: payload.data,
      };
    },
    // 用户日活
    saveUserDay (state, { payload }) {
      return {
        ...state,
        userDayData: payload.data,
      };
    },
    
     // 存储意向客户登记分日数据
     saveUserDailyRegister (state, { payload }) {
      return {
        ...state,
        userDailyRegisterData: payload.data,
      };
    },
     // 存储用户到访分日数据
     saveUserDailyVisit (state, { payload }) {
      return {
        ...state,
        userDailyVisitData: payload.data,
      };
    },
    // 存储用户认筹分日数据
    saveUserDailyRenchou (state, { payload }) {
      return {
        ...state,
        userDailyRenchouData: payload.data,
      };
    },
    // 用户认购分日数据
    saveUserBuy (state, { payload }) {
      return {
        ...state,
        userBuyData: payload.data,
      };
    },
    // 总用户数,总认筹数,总认购数,总认购金额
    saveTotalUser (state, { payload }) {
        return {
          ...state,
          totalUserData: payload.data,
        };
      },
    // 业主/供应商/蓝光员工/自然客户
    saveFourDetail (state, { payload }) {
      return {
        ...state,
        fourDetailData: payload.data,
      };
    },
    // 7天楼盘浏览量前十
    saveProjectBrowse (state, { payload }) {
      return {
        ...state,
        projectBrowseData: payload.data,
      };
    },
    // 历史楼盘收藏量前十
    saveProjectCollect (state, { payload }) {
      return {
        ...state,
        projectCollectData: payload.data,
      };
    },
    // 总认购金额
    saveTotalUserBuy (state, { payload }) {
      return {
        ...state,
        totalUserBuyData: payload.data,
      };
    },
    
    // 各渠道新增用户数
    saveChannelUserAdd (state, { payload }) {
      return {
        ...state,
        channelUserAddData: payload.data,
      };
    },

  },
})
