import 'whatwg-fetch' // fetch
import * as actions from 'actions/'
import userInfo from 'state/userInfo.data'
import config from 'state/config.data'
import { store } from 'src/redux/'
import qs from 'qs'
import _ from 'lodash'
import axios from 'axios'

let baseUrl = process.env.API_ROOT
let YXbaseUrl = process.env.YXAPI_ROOT

const toast = function (status, message) {
  store.dispatch(actions.showToast({ message }))
  setTimeout((status) => {
    store.dispatch(actions.showToast({ message: '' }))
    if (status == '1008') {
      window.location.href = "#/login"
    }
  }, 2000)
}
// 初始化axios
var instance = axios.create({
  timeout: 12000,
  headers: {
    "Content-Type": 'application/x-www-form-urlencoded',
    'deviceType': config.DEVICETYPE,
    'proId': config.PROID,
    'version': '007'
  }
})
export default function ({url, data, type, proId}) {
  let realUrl = ''
  if (type == 'YX') {
    realUrl = YXbaseUrl
  } else {
    realUrl = baseUrl
  }
  return instance({
    method: 'post',
    url: realUrl + url,
    data: qs.stringify(data),
    headers: {
       'token': userInfo.baseInfo.token ,
       't': new Date().getTime() * 1000
    }
  }).then(res => {
    let data = res.data
    // token失效并且不在首页的情况下不自动跳转到登陆页面
    if (data.status == 1008) {
       window.localStorage.removeItem('token')
       store.dispatch(actions.updateBaseInfo({ token: 'wankatoken' }))
       if (store.getState('routing').routing.locationBeforeTransitions.pathname != '/') {
         toast()
       }
    }
    return data || {}
  }, (error) => {
    toast(null, '网络不给力，请重新尝试')
    store.dispatch(actions.updateLoading(false))
  })
}
