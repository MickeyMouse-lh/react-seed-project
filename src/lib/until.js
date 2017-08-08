import * as actions from 'actions/'
import { hashHistory } from 'react-router'
// 截取url 里面token的值
export const getQueryString = name => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  let params = window.location.search.substr(1) || window.location.href.split('?')[1]
  let r = params && params.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// 判断当前是否是安卓手机
export const is_android = () => {
  var ua = navigator.userAgent.toLocaleLowerCase()
  if (ua.indexOf('android') > -1 || ua.indexOf('linux') > -1) {
    return true
  } else {
    return false
  }
}
// 判断参数是否为空
export const isBlank = type => {
	if(type =="" || type == null || type == undefined || type=="null"){
		return true;
	}
	return false;
}

// 登陆方法
export const login = function (store) {
  // 跳转到登陆页面之前先把token清除掉
  window.localStorage.removeItem('token')
  store.dispatch(actions.updateBaseInfo({ token: 'wankatoken' }))
  // window.location.href = "#/login"
  hashHistory.push('/login')
}
