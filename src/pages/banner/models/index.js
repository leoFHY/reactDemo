/* global window */

import { message } from 'antd';
import {
  queryList,
  fetchProjectList,
  deleteBanner,
  addOrUpdateBanner,
} from '../services'
import { deepCopy } from 'utils/copy'

export default {
    namespace: 'banner',
    state: {
      // 商品名称列表
      goodsList: [],
      // 保存图片
      listImg: [],
      // 列表数据
      dataSource: [],
      // 商品/楼盘/房源列表
      projectList: [],
      // 暂存列表数据
      storageList: {},
      previewShow: false,
      previewSrc: '',
      typeList: [{
          id: '',
          name: '全部',
        },{
          id: '1',
          name: '蓝光员工',
        }, {
          id: '2',
          name: '业主／租户／商户',
        }, {
          id: '3',
          name: '供应商',
        }, {
          id: '4',
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
      typeLists: [{
          id: '1',
          name: '蓝光员工',
        }, {
          id: '2',
          name: '业主／租户／商户',
        }, {
          id: '3',
          name: '供应商',
        }, {
          id: '4',
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
      linkType1: [
        {
          id: '1',
          name: '楼盘',
        }, 
        {
          id: '2',
          name: 'url',
        },
        {
          id: '3',
          name: '邀请好友',
        },
      ],
       linkType2: [{
           id: '0',
           name: '--',
         }, {
           id: '1',
           name: '楼盘',
         },
         {
           id: '2',
           name: 'url',
         },
         {
           id: '3',
           name: '邀请好友',
         },
       ],
      bannerType: 0
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(location => {
          if (location.pathname === '/banner') {
            dispatch({
              type: 'getList',
              payload: {},
            });
            dispatch({
              type: 'getProjectList',
              payload: {},
            });
          }
        });
      },
    },

    effects: {
       // 请求列表
      *getList ({ payload, success }, { put, call, select }) {
        const ret = yield call(queryList, payload);
        const { code,data } = ret
        if (code === 'S000000') {
          data.forEach((v,i) => {
            v.fileList = []
            v.fileList[0] = {}
            v.fileList[0]["uid"] = i
            // v.fileList[0]["status"] = 'done'
            v.fileList[0] = Object.assign({'status':'done'}, v.fileList[0])
            v.fileList[0]["url"] = v.picUrl
          });
          yield put ({
            type: 'saveData',
            payload: {
              data,
            },
          })
          if(success)  success() 
        } else {
          message.warning(ret.message)
        }
      },
      //查询 商品名称列表
      *getProjectList ({ payload }, { put, call, select }) {
        const ret = yield call(fetchProjectList, payload);
        const { code, data } = ret
        if (code === 'S000000') {
          yield put ({
            type: 'saveProjectList',
            payload: {
              data
            },
          })
        } else {
          message.warning(ret.message)
        }
      },
      // 更新Banner
      *updateBanner ({ payload, success }, { put, call, select }) {
        const ret = yield call(addOrUpdateBanner, payload);
        const { code } = ret
        if (code === 'S000000') {
          message.success('操作成功')
          yield put({
            type: 'getList',
            payload: {
            }
          })
          success ()
        } else {
          message.warning(ret.message)
          yield put({
            type: 'saveMediaImages',
            payload: {
              data: []
            }
          })
        }
      },
      // 删除banner
      *del ({ payload }, { put, call, select }) {
        const ret = yield call(deleteBanner, payload);
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
          yield put({
            type: 'getList',
            payload: {
            }
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
      // 保存banner图片
      saveMediaImages (state, { payload }) {
        return {
          ...state,
          listImg: payload.data,
        };
      },
      // 存储列表数据
      saveData (state, { payload }) {
        
        return {
          ...state,
          dataSource: payload.data,
        };
      },
      // 获取商品/楼盘/房源列表
      saveProjectList (state, { payload }) {
        return {
          ...state,
          projectList: payload.data,
        };
      },
      // 暂存列表数据
      storageDate (state, { payload }) {
        return {
          ...state,
          storageList: payload.data,
          listImg: deepCopy(payload.data.fileList),
        };
      },
      openPreview (state, { payload }) {
        return {
          ...state,
          previewShow: payload.previewShow,
          previewSrc: payload.previewSrc,
        };
      },
      removeImg (state, {payload}){
        return {
          ...state,
          listImg: [],
        }
      },
      saveBannerType (state, { payload }) {
        return {
          ...state,
          bannerType: payload,
        };
      },
    } 
  }
