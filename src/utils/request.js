import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import qs from 'qs'
import * as develpment from './developmentProperties'
import upload from './xhrUpload'

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options, preName = '') {
  let { data, url, method = 'get',formData } = options
  
  //改变请求路径
  switch (preName) {
     case 'sys':
        url = develpment.sysDevelopment() + url
     break
     case 'pic':
        url = develpment.picDevelopment() + url
     break
     default: 
     url = develpment.mainDevelopment() + url
  }
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : url
  
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })
  if (options.formData) {
    options.headers = { 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryemwBWImc8jR8dFz4'}
  }
  return axios(options)
    .then(response => {
      const { statusText, status, data } = response
      
      const responseUrl = response.request.responseURL
      const login = responseUrl.split('?')[0].split('/')
      if (login[login.length-1] === 'login') {
        window.location = responseUrl
      } else if (response.data.code === 'S0001') {
          message.warning('登录已超时,请重新登录')
          window.location = window.location.origin
      }
      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
