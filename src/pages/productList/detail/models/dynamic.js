/* global window */
import modelExtend from 'dva-model-extend'
import { filterModel } from 'utils/newModel'
import { message } from 'antd';

import {
  addProjectAction,
  deleteProjectAction,
  projectActionPage
}
from '../services/dynamic'

export default modelExtend(
  filterModel({ reqFn: projectActionPage, namespace: 'dynamic'}),
  {
    namespace: 'dynamic',
    state: {
      dynamicInfo: '',
      titleData: '',
      // 保存图片
      listImg: [],
      previewShow: false,
      previewSrc: '',
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen(location => {
       
        // });
      },
    },

    effects: {
     
       // 新增/修改优惠活动
      *addList ({ payload, success }, { put, call }) {
        const ret = yield call(addProjectAction, payload)
        const { code, data } = ret
        if (code === 'S000000') {
          message.success('保存成功')
          success && success()
        } else {
          message.warning(ret.message)
        }
      },
      *getDel ({ payload, success }, { call }) {
        const ret = yield call(deleteProjectAction, payload)
        const { code } = ret
        if (code === 'S000000') {
          message.success('删除成功')
          success && success()
        } else {
          message.warning(ret.message)
        }
      }, 
    },
    reducers: {
      saveInfo (state, { payload }) {
        return {
          ...state,
          dynamicInfo: payload.data.dynamicInfo,
        };
      },
      saveTitle (state, { payload }) {
        return {
          ...state,
          titleData: payload.data.titleData,
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
      saveMediaImages (state, { payload }) {
        return {
          ...state,
          listImg: payload.data,
        };
      },

    } 
  }
)
