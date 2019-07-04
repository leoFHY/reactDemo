/* global window */

import { router } from 'utils'
// import { stringify } from 'qs'
import store from 'store'
// import { ROLE_TYPE } from 'utils/constant'
// import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
// import config from 'config'
import { message } from 'antd'
import { bucket } from 'services/bucket.js'
const { queryRouteList, logoutUser, queryUserInfo } = api
import { getUserImport, getUserMenu} from 'services/app.js'

export default {
  namespace: 'app',
  state: {
    user: {
      username: "admin",
      permissions: {
        role: "admin",
        visit: ['11', '12','13', '14' ,'15', '16', '21', '31', '32','33','41','51','61','62','63','71','72','73'],
      },
      id: 0,
      avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
      loginName: '',
      userId: '',
    },
    permissions: {
      role: 'admin',
      // visit: ['1', '2','22' , '3','31','33', '5', '6', '7'],
      visit: ['11', '12','13', '14' ,'15', '16', '21', '31', '32','33','41','51','61','62','63'],
    },
    
    routeList: [
      {
        id: '1',
        icon: 'home',
        name: '报表',
        zhName: '报表',
        children:[
          {
            id: '11',
           
            name: '整体运营报表',
            zhName: '整体运营报表',
            route: '/home',
            
          },
          {
            id: '12',
            breadcrumbParentId: '1',
            name: '首页导流报表',
            zhName: '首页导流报表',
            
            route: '/diversionReport',
          },
          {
            id: '13',
            breadcrumbParentId: '1',
            name: '平台流量报表',
            zhName: '平台流量报表',
           
            route: '/trafficReport',
          },
          {
            id: '14',
            breadcrumbParentId: '1',
            name: '楼盘互动报表',
            zhName: '楼盘互动报表',
           
            route: '/interactive',
          },
         
          {
            id: '15',
            breadcrumbParentId: '1',
            name: '成交客户报表',
            zhName: '成交客户报表',
       
            route: '/customerDetail',
          },
          
        ]
      }
      
      , {
        id: '2',
        icon: 'user',
        breadcrumbParentId: '1',
        name: '客户',
        zhName: '客户',
       
        children:[
          {
            id: '21',
           
            breadcrumbParentId: '1',
            name: '客户统计',
            zhName: '客户统计',
            route: '/customer',
            
          },
          
        ]
      }, {
        id: '',
        breadcrumbParentId: '2',
        menuParentId: '-1',
        name: '客户统计详情',
        zhName: '客户统计详情',
        icon: 'bank',
        
        children:[
          {
            id: '',
            breadcrumbParentId: '2',
            menuParentId: '-1',
            name: '客户统计详情',
            zhName: '客户统计详情',
           
            route: '/customer/detail',
            
          }
        ]
        
      }, {
        id: '3',
        breadcrumbParentId: '1',
        name: '商品',
        zhName: '商品',
        icon: 'bank',
        // route: '/customerDetail',
        children:[
          
          {
            id: '31',
            breadcrumbParentId: '1',
            name: '商品管理',
            zhName: '商品管理',
           
            route: '/productList',
          },
          {
            id: '32',
            breadcrumbParentId: '1',
            name: '推荐商品',
            zhName: '推荐商品',
           
            route: '/defaultRecommend',
          },
          // {
          //   id: '33',
          //   breadcrumbParentId: '5',
          //   menuParentId: '-1',
          //   name: '商品详情',
          //   zhName: '商品详情',
            
          //   route: '/productList/detail',
          // }, 
        ]
      },
      {
        id: '7',
        breadcrumbParentId: '1',
        name: '活动',
        zhName: '活动',
        icon: 'gift',
        // route: '/customerDetail',
        children:[
          
          {
            id: '71',
            breadcrumbParentId: '1',
            name: '荷兰拍报表',
            zhName: '荷兰拍报表',
          
            route: '/netherlands',
            // children:[
            //   {
            //     id: '',
            //     breadcrumbParentId: '2',
            //     menuParentId: '-1',
            //     name: '批量添加荷兰拍',
            //     zhName: '批量添加荷兰拍',
               
            //     route: '/netherlands/addhelanpais',
                
            //   }
            // ]
          },
          {
            id: '62',
            breadcrumbParentId: '1',
            name: '抽奖管理',
            zhName: '抽奖管理',
            
            route: '/raffle',
          },
          
        ]
      },
      
      {
        id: '4',
        breadcrumbParentId: '1',
        name: '渠道',
        zhName: '渠道',
        icon: 'qrcode',
        // route: '/defaultRecommend',
        children:[
          {
            id: '41',
            breadcrumbParentId: '1',
            name: '渠道管理',
            zhName: '渠道管理',
            route: '/channel',
          },
        ]
      },
      {
        id: '5',
        breadcrumbParentId: '1',
        name: '供应商',
        zhName: '供应商',
        icon: 'solution',
        // route: '/defaultRecommend',
        children:[
          
          {
            id: '51',
            breadcrumbParentId: '1',
            name: '供应商管理',
            zhName: '供应商管理',
            icon: 'solution',
            route: '/supplier',
          },
        ]
        },  
        {
        id: '6',
        breadcrumbParentId: '1',
        name: '内容配置',
        zhName: '内容配置',
        icon: 'filter',
        // route: '/productList',
        children:[
          {
            id: '61',
            breadcrumbParentId: '1',
            name: 'Banner管理',
            zhName: 'Banner管理',
            icon: 'filter',
            route: '/banner',
          },  {
            id: '63',
            breadcrumbParentId: '1',
            name: '开关管理',
            zhName: '开关管理',
            icon: 'tool',
            route: '/switch',
          },
        ]
      },
      {
        id: '8',
        breadcrumbParentId: '1',
        name: '优惠券',
        zhName: '优惠券',
        icon: 'filter',
        // route: '/productList',
        children:[
          {
            id: '81',
            breadcrumbParentId: '1',
            name: '优惠券管理',
            zhName: '优惠券管理',
            route: '/coupons/couponManagement',
          },  
          {
            id: '82',
            breadcrumbParentId: '1',
            name: '开关管理',
            zhName: '开关管理',
            route: '/coupons/couponBatch',
          },
          {
            id: '83',
            breadcrumbParentId: '1',
            name: '开关管理',
            zhName: '开关管理',
            route: '/coupons/couponTemplateManagement',
          },
        ]
      }, 
      {
        id: '10',
        breadcrumbParentId: '1',
        name: '大众经纪人',
        zhName: '大众经纪人',
        icon: 'filter',
        // route: '/productList',
        children: [{
            id: '81',
            breadcrumbParentId: '10',
            name: '大众经纪人列表',
            zhName: '大众经纪人列表',
            route: '/agent/public',
          }, {
            id: '82',
            breadcrumbParentId: '10',
            name: '推介列表',
            zhName: '推介列表',
            route: '/agent/marketing',
          }, {
            id: '83',
            breadcrumbParentId: '10',
            name: '成交列表',
            zhName: '成交列表',
            route: '/agent/success',
          }, {
            id: '84',
            breadcrumbParentId: '10',
            name: '佣金列表',
            zhName: '佣金列表',
            route: '/agent/commission',
          },
          
        ]
      },
    ],
    // test
    menuList: [],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
    ossBuckedData: null,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        if(location.pathname === '/') {
           dispatch({
             type: "getUser",
           })
           dispatch({
             type: 'getMenu',
           })
           router.replace('/home')
        } 
        
      })
       
    },
    
    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({ dispatch }) {
       dispatch({
         type: 'query',
       })
      dispatch({
        type: "getUser",
      })
      dispatch({
        type: 'getMenu',
      })
    },
  },
  effects: {
    *getUser ({},{call,put}) {
      const ret = yield call(getUserImport)
      const { code, data } = ret
      if (code === 'S000000') {
         yield put({
           type: 'saveUser',
           payload: {
             data
           },
         })
       } else {
         message.warning(ret.message)
       }
    },
    * getMenu({},{call, put}) {
      const ret = yield call(getUserMenu)
      const { code, data } = ret
      if (code === 'S000000') {
        //  data.shift()
         yield put({
           type: 'saveMenu',
           payload: {
             data,
           },
         })
       } else {
         message.warning(ret.message)
       }
    },
    *query({ payload }, { call, put, select }) {
      
      // const { success, user } = yield call(queryUserInfo, payload)
      // const { locationPathname } = yield select(_ => _.app)

      // if (success && user) {
        // const { list } = yield call(queryRouteList)
        // const { permissions } = user
        // let routeList = list
        // if (
        //   permissions.role === ROLE_TYPE.ADMIN ||
        //   permissions.role === ROLE_TYPE.DEVELOPER
        // ) {
        //   permissions.visit = list.map(item => item.id)
        // } else {
        //   routeList = list.filter(item => {
        //     const cases = [
        //       permissions.visit.includes(item.id),
        //       item.mpid
        //         ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
        //         : true,
        //       item.bpid ? permissions.visit.includes(item.bpid) : true,
        //     ]
        //     return cases.every(_ => _)
        //   })
        // }
            // yield put({
            //   type: 'updateState',
            //   payload: {
            //     user,
            //     permissions,
            //     routeList,
            //   },
            // })
            // if (pathMatchRegexp(['/','/login'], window.location.pathname)) {
            //   router.push({
            //     pathname: '/dashboard',
            //   })
            // }
      // } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        // router.push({
        //   pathname: '/login',
        //   search: stringify({
        //     from: locationPathname,
        //   }),
        // })
      // }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logoutUser)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            user: {},
            permissions: { visit: [] },
            menu: [
              {
                id: '1',
                icon: 'laptop',
                name: 'Dashboard',
                zhName: '仪表盘',
                router: '/dashboard',
              },
            ],
          },
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  * bucketList ({ payload }, { put, call }) {
      const ret = yield call(bucket, '')
      yield put({
        type: 'bucketListState',
        payload: ret,
      })
    },
  reducers: {
    updateState(state, { payload }) {
      
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
    bucketListState (state, { payload }) {
      // console.log('==========oss', payload)
      return {
        ...state,
        ossBuckedData: payload.data,
      }
    },
    saveUser (state, { payload }) {
      return {
        ...state,
        user: {
          ...state.user,
          loginName: payload.data.userName,
          userId: payload.data.userId,
        }
      }
    },
    saveMenu (state, { payload }) {
      return {
        ...state,
        menuList: payload.data
      }
    },
  },
}
