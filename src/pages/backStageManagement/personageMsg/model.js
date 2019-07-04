import { message } from 'antd'
// import { hashHistory } from 'dva/router'
import {
  getUserMsg,
  modifyPassword,
  updateMem,
} from './service'
import {
  mediaList,
  dictList,
} from '../userManagement/service'

export default {
  namespace: 'personageMsg',
  state: {
    oldPwd: '',
    firstPwd: '',
    secondPwd: '',
    detail: {
      photo: [{ uid: '-1', url: '' }],
    },
    dictList: [],
    mediaList: [],
  },
  subscriptions: {
  },
  effects: {
    * getMediaList (action, { call, put }) {
      const ret = yield call(mediaList, action.payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'mediaList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getDictList (action, { call, put }) {
      const ret = yield call(dictList, { type: 'sys_user_type' })
      if (ret.code === 'S000000') {
        yield put({
          type: 'dictList',
          payload: ret.data,
        })
      } else {
        message.warning(ret.message)
      }
    },
    * getUserMsg ({ payload }, { call, put }) {
      const ret = yield call(getUserMsg, payload)
      if (ret.code === 'S000000') {
        yield put({
          type: 'detail',
          payload: {
            detail: ret.data,
          },
        })
      } else {
        message.warning(ret.message)
      }
    },
    * updateMem ({ payload }, { call }) {
      const ret = yield call(updateMem, payload)
      if (ret.code === 'S000000') {
        message.success('个人信息修改成功')
      } else {
        message.warning(ret.message)
      }
    },
    * modifyPassword ({ payload }, { call }) {
      const ret = yield call(modifyPassword, payload)
      if (ret.code === 'S000000') {
        message.success('密码修改成功')
      } else {
        message.warning(ret.message)
      }
    },
  },
  reducers: {
    dictList (state, { payload }) {
      return { ...state, dictList: payload.list }
    },
    mediaList (state, { payload }) {
      return { ...state, mediaList: payload }
    },
    detail (state, { payload }) {
      let detail = payload.detail
      if (detail.photo) {
        detail.photo = [{ uid: '-2', url: detail.photo, status: 'done' }]
      } else {
        detail.photo = [{ uid: '-1', url: '' }]
      }
      return { ...state, detail }
    },
  },
}
