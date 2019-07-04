import { bucket } from 'services/bucket'

export default {
  namespace: 'bucket',
  state: {
    bucketData: {},
    dir: 'brc-admin/',
    host: 'http://xxbkt.oss-cn-beijing.aliyuncs.com',
    imageUrl: '',
    imageUrlList: [],
    uploadFileList: [],
  },
  effects: {
    * getBucketData ({payload = {}}, { put, call }) {
      payload.dir = payload.dir || 'deliveryDefault/'
      const ret = yield call(bucket, payload)
      yield put({
        type: 'getBucketDataSuccess',
        payload: ret,
      })
    },
    * renewFileName ({ payload }, { put, select }) {
      // console.log(payload)
      const dir = yield select(state => state.bucket.dir)
      const imageUrlList = yield select(state => state.bucket.imageUrlList)
      const uploadFileList = yield select(state => state.bucket.uploadFileList)
      const host = yield select(state => state.bucket.host)
      const fileName = new Date().getTime()
      const i = payload.name.lastIndexOf('.')
      const name = payload.name.slice(i)
      const imageUrl = `${dir}${payload.uid}${fileName}${name}`
      imageUrlList.push(`${host}/${imageUrl}`)
      uploadFileList.push({
        uid: payload.uid,
        name: payload.name,
        url: `${host}/${imageUrl}`,
        status: 'uploading',
      })
      yield put({
        type: 'renewFileNameData',
        payload: {
          imageUrl,
          uid: payload.uid,
          fileName,
          imageUrlList,
          uploadFileList,
        },
      })
    },
  },
  reducers: {
    getBucketDataSuccess (state, { payload }) {
      return {
        ...state,
        bucketData: {
          OSSAccessKeyId: payload.data.accessid,
          policy: payload.data.policy,
          signature: payload.data.signature,
          success_action_status: '200',
        },
        dir: payload.data.dir,
        host: payload.data.host,
        fileName: new Date().getTime(),
      }
    },
    renewFileNameData (state, { payload }) {
      return {
        ...state,
        bucketData: { ...state.bucketData, key: payload.imageUrl },
        uid: payload.uid,
        fileName: payload.fileName,
        imageUrl: payload.imageUrl,
        imageUrlList: payload.imageUrlList,
        uploadFileList: payload.uploadFileList,
      }
    },
    changeUploadFileList (state, { payload }) {
      return {
        ...state,
        uploadFileList: payload,
      }
    },
  },
}
