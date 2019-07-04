import { message } from 'antd';
import {
  channelList,
  userAge,
  userHouse,
  userIdentity,
  userDetail,
  userBehaviorLog,
} from '../services';

export default {
    namespace: 'customer',
    state: {
      // 各渠道来源情况
      channelList: [],
      // 用户年龄分布
      userAgeList: [],
      // 拥有蓝光房源套数
      userHouseList: [],
      // 各身份类型用户数
      userIdentityList: [],
      userDetailObj: {},
      userT: ['','蓝光员工', '业主／租户／商户', '供应商', '自然客户', '','蓝朋友'],
      typeLists: [{
        id: '1',
        name: '蓝光员工',
      }, {
        id: '2',
        name: '业主',
      }, {
        id: '3',
        name: '供应商',
      }, {
        id: '0',
        name: '自然客户',
      }, 
      // {
      //   id: '5',
      //   name: '手牵手',
      // }
      {
        id: '6',
        name: '蓝朋友',
      }
    ],
      userBehaviorLogList: [],
      pagination: {
        pageSize:10,
        pageNum:1,
        total:0
      },
      actionType: [{
        id: '1',
        name: '查看楼盘详情',
      }, {
        id: '2',
        name: '查看房源详情',
      }, {
        id: '3',
        name: '收藏楼盘',
      }, {
        id: '4',
        name: '取消收藏楼盘',
      }, {
        id: '5',
        name: '收藏房源',
      }, {
        id: '6',
        name: '取消收藏房源',
      }, {
        id: '7',
        name: '登录',
      }],
      sexList: [{
        id: '1',
        name: '男',
      }, {
        id: '2',
        name: '女',
      }]
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/customer') {
            dispatch({
              type: 'getChannelList',
              payload: {},
            })
            dispatch({
              type: 'getUserAge',
              payload: {},
            })
            dispatch({
              type: 'getUserHouse',
              payload: {},
            })
            dispatch({
              type: 'getUserIdentity',
              payload: {},
            })
          }
          if (location.pathname === '/customer/detail') {

          }
        });
      },
    },

    effects: {
       // 各渠道来源情况
      *getChannelList ({}, { put, call }) {
        const ret = yield call(channelList, {});
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveChannelList',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 用户年龄分布
      *getUserAge ({}, { put, call }) {
        const ret = yield call(userAge, {});
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveUserAge',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
       // 拥有蓝光房源套数
      *getUserHouse ({}, { put, call }) {
        const ret = yield call(userHouse, {});
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveUserHouse',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 各身份类型用户数
      *getUserIdentity ({}, { put, call }) {
        const ret = yield call(userIdentity, {});
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveUserIdentity',
            payload: {
              data
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 用户详情
      *getUserDetail ({ payload, success }, { put, call }) {
        const ret = yield call(userDetail, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          message.success('查询成功')
          yield put({
            type: 'saveUserDetail',
            payload: {
              data
            }
          })
          success && success()
        } else {
          message.warning(ret.message)
        }
      },
       // 用户日志
      *getUserBehaviorLog ({ payload }, { put, call }) {
        const ret = yield call(userBehaviorLog, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          yield put({
            type: 'saveUserBehaviorLog',
            payload: {
              data: {
                list: data.list,
                pagination: {
                  pageCount: data.pageCount,
                  pageNum: data.pageNum,
                  pageSize: data.pageSize,
                  total: data.total,
                }
              }
            }
          })
        } else {
          message.warning(ret.message)
        }
      },
    },
    reducers: {
      // 各渠道来源情况
      saveChannelList (state, { payload }) {
        return {
          ...state,
          channelList: payload.data,
        };
      },
      // 各渠道来源情况
      saveUserAge (state, { payload }) {
        return {
          ...state,
          userAgeList: payload.data,
        };
      },
      // 拥有蓝光房源套数
      saveUserHouse (state, { payload }) {
        return {
          ...state,
          userHouseList: payload.data,
        };
      },
      // 各身份类型用户数
      saveUserIdentity (state, { payload }) {
        return {
          ...state,
          userIdentityList: payload.data,
        };
      },
      // 用户详情
      saveUserDetail (state, { payload }) {
        return {
          ...state,
          userDetailObj: payload.data,
        };
      },
      // 用户日志
      saveUserBehaviorLog (state, { payload }) {
        return {
          ...state,
          userBehaviorLogList: payload.data.list,
          pagination: payload.data.pagination
        };
      },
    }
  };
