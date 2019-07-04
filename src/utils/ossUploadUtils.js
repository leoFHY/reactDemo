import { getRdmStr } from './transformData'

export function onFileSelectChange (e, bucket) {
  let ret = null
  if (Array.isArray(e.fileList)) {
    ret = e.fileList.filter(file => !file.status || file.status === 'done' || file.status === 'uploading')
    if (e.file.uid === bucket.uid && e.file.status === 'done') {
      let data = {
        uid: e.file.uid,
        name: e.file.name,
        url: `${bucket.host}/${bucket.bucketData.key}`,
      }
      ret = e.fileList.slice(0, e.fileList.length - 1)
      ret.push(data)
    }
  } else {
    ret = []
  }
  return ret
}
export function beforeUpload (e, dispatch) {
  
  dispatch({
    type: 'bucket/renewFileName',
    payload: { uid: e.uid, name: e.name },
  })
}
export function renewBucketData(dispatch, fileName) {
  dispatch({
    type: 'bucket/getBucketData',
    payload: {
      dir: fileName,
    },
  })
}


export function openFileUpload (e, dispatch, fileName) {
  console.log('openFileUpload', e, 
  // dispatch, 
  fileName
  )
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'IMG') {
    renewBucketData(dispatch, fileName)
  }
}

//图片列表
export function newOpenFileUpload (e, dispatch, fileName) {
  console.log('newOpenFileUpload', e, dispatch, fileName)
  // return
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'IMG') {
    renewBucketData(dispatch, fileName)
  }
}



export function imageUpload (f, bucket, ReactUeditor) {
 
  let uid = new Date().getTime()
  let file = f.target.files[0]
  console.log('mmmmmmmm', file)
  let xhr = new XMLHttpRequest()
  let fromData = new FormData()
  let key = `${bucket.dir}${uid}${file.name}`
  fromData.append('OSSAccessKeyId', bucket.bucketData.OSSAccessKeyId)
  fromData.append('policy', bucket.bucketData.policy)
  fromData.append('signature', bucket.bucketData.signature)
  fromData.append('key', key)
  fromData.append('success_action_status', '200')
  fromData.append('file', file)
  xhr.open('post', bucket.host, true)
  xhr.send(fromData)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('富文本上传图片成功')
        ReactUeditor.insertImage(`${bucket.host}/${key}`)
      }
    }
  }
}

export const multipleImageUpload = (f, bucket) => {
  // console.log('富文本参数', f, bucket)
  // return new Promise((resolve, reject) => {
  let time = new Date().getTime()
  let file = f.file
  const name = file.name.split('.')[1]

  let xhr = new XMLHttpRequest()
  let fromData = new FormData()
  let key = `${bucket.dir}${getRdmStr(8)}${time}.${name}`
  fromData.append('OSSAccessKeyId', bucket.bucketData.OSSAccessKeyId)
  fromData.append('policy', bucket.bucketData.policy)
  fromData.append('signature', bucket.bucketData.signature)
  fromData.append('key', key)
  fromData.append('success_action_status', '200')
  fromData.append('file', file)
  xhr.open('post', bucket.host, true)
  xhr.send(fromData)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const url = `${bucket.host}/${key}`
        console.log('批量上传图片路径', url)
        // resolve(url)
        f.onSuccess(url)
        // return {
        //   status: 'done',
        //   url,
        // }
      } else {
        f.onError()
        // reject('图片上传失败！')
      }
    }
  }
  //})
}

// 上传多图fan修改
export const multipleImageUploadFan = (f, bucket) => {
  // console.log('富文本参数', f, bucket)
  return new Promise((resolve, reject) => {
    let time = new Date().getTime()
    let file = f
    const i = file.name.lastIndexOf('.')
    const name = file.name.slice(i)
    let xhr = new XMLHttpRequest()
    let fromData = new FormData()
    let key = `${bucket.dir}${getRdmStr(8)}${time}${name}`
    fromData.append('OSSAccessKeyId', bucket.bucketData.OSSAccessKeyId)
    fromData.append('policy', bucket.bucketData.policy)
    fromData.append('signature', bucket.bucketData.signature)
    fromData.append('key', key)
    fromData.append('success_action_status', '200')
    fromData.append('file', file)
    xhr.open('post', bucket.host, true)
    xhr.send(fromData)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const url = `${bucket.host}/${key}`
          //  console.log('批量上传图片路径', url)
          resolve(url)
        } else {
          reject('图片上传失败！')
        }
      }
    }
  })
}


export const editorImageUpload = (bucket, f) => {
  return new Promise((resolve, reject) => {
    let time = new Date().getTime()
    let file = f
    const i = file.name.lastIndexOf('.')
    const name = file.name.slice(i)
    let xhr = new XMLHttpRequest()
    let fromData = new FormData()
    let key = `${bucket.dir}${getRdmStr(8)}${time}${name}`
    fromData.append('OSSAccessKeyId', bucket.bucketData.OSSAccessKeyId)
    fromData.append('policy', bucket.bucketData.policy)
    fromData.append('signature', bucket.bucketData.signature)
    fromData.append('key', key)
    fromData.append('success_action_status', '200')
    fromData.append('file', file)
    xhr.open('post', bucket.host, true)
    xhr.send(fromData)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const url = `${bucket.host}/${key}`
          resolve({
            data: {
              link: url,
            },
          })
        } else {
          reject('图片上传失败！')
        }
      }
    }
  })
}

export const fileUploadMore = (bucket, f) => {
  return new Promise((resolve, reject) => {
    let time = new Date().getTime()
    let file = f
    // const name = file.name.split('.')[1]
    let xhr = new XMLHttpRequest()
    let fromData = new FormData()
    let key = `${bucket.dir}${getRdmStr(8)}${time}`
    fromData.append('OSSAccessKeyId', bucket.bucketData.OSSAccessKeyId)
    fromData.append('policy', bucket.bucketData.policy)
    fromData.append('signature', bucket.bucketData.signature)
    fromData.append('key', `${key}/${file.name}`)
    fromData.append('success_action_status', '200')
    fromData.append('file', file)
    xhr.open('post', bucket.host, true)
    xhr.send(fromData)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const url = `${bucket.host}/${key}/${file.name}`
          resolve({
            url: url,
            uid: file.uid,
            name: file.name,
          })
        } else {
          const url = `${bucket.host}/${key}/${file.name}`
          reject(url)
        }
      }
    }
  })
}
