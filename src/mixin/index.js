
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { showAlert, updateBaseInfo, showTwoBtnAlert, updateLoading } from 'actions/'
import { fetchBillList } from 'fetchActions/fetchBillList'
import { fetchQualifiCa } from 'fetchActions/fetchQualifiCa'
import { updateToastMessage } from 'fetchActions/updateToastMessage'
import { fetchUserStatus } from 'fetchActions/fetchUserStatus'
import { fetchOneCardInfo } from 'fetchActions/fetchOneCardInfo'
import { fetchBaseUserInfo } from 'fetchActions/fetchBaseUserInfo'
import { fechUserPhoto } from 'fetchActions/fechUserPhoto'
import { login, isBlank } from 'lib/until'
import { store } from 'src/redux/'
import fetch from 'lib/http'

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      showAlert: (info) => dispatch(showAlert(info)),
      showTwoBtnAlert: (info) => dispatch(showTwoBtnAlert(info)),
      fetchBillList: (params) => dispatch(fetchBillList(params)),
      fetchQualifiCa: (params) => dispatch(fetchQualifiCa(params)),
      updateBaseInfo: (params) => dispatch(updateBaseInfo(params)),
      updateToastMessage: (params) => dispatch(updateToastMessage(params)),
      fetchUserStatus: (params) => dispatch(fetchUserStatus(params)),
      fetchBaseUserInfo: (params) => dispatch(fetchBaseUserInfo(params)),
      fechUserPhoto: (params) => dispatch(fechUserPhoto(params)),
      fetchOneCardInfo: (params) => dispatch(fetchOneCardInfo(params)),
      updateLoading: (flag) => dispatch(updateLoading(flag))
    }
  }
}

// 将state绑定到props的state
const mapStateToProps = state => {
  return {
    state: {
      api: state.api,
      userInfo: state.userInfo,
      billList: state.billList,
      oneCardInfo: state.oneCardInfo,
      config: state.config,
      dentityInfo: state.dentityInfo
    }
  }
}
@connect(mapStateToProps, mapDispatchToProps)
export const DefaultNameMixin = (ComposedComponent) => class extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {    // .cashLoan()
    console.log(this)
  }

  cashLoan () {
    console.log(this.props)
    console.log('成功')
    let { showTwoBtnAlert } = this.props.actions
    let { userInfo, config, billList } = this.props.state
    let creditCardFlag = false // 信用卡开关（true为开，false为关）
    // 如果用户没有登陆直接跳转到登陆页面
    if (isBlank(userInfo.baseInfo.token) || userInfo.baseInfo.token == 'wankatoken') {
      login(store)
      return false
    }
    // 灰度检测
    if (config.DOGRAY == 'F') {
      // 跳转到系统维护页面
      // window.location.href = 'https://wx-cdn.9fbank.com/static/activity/wk_activity/systemupdate.html' // 跳转到系统维护页面
      window.location.href = 'https://onecard.9fbank.com/static/activity/wk_activity/systemupdate.html' // 跳转到下载页面 6-6 修改
      return false
    }
    // 如果有账单不允许用户继续借款
    if (billList.cashOrder.length > 0) {
      showTwoBtnAlert({
        message: '您在万卡已有借款记录,请登录万卡APP查看',
        leftBtnText: '知道了',
        rightBtnText: '去下载',
        rightBtnFn () {
          // 跳转到下载页面
          // window.location.href = 'https://wx-cdn.9fbank.com/static/activity/wk_activity/download.html' // 跳转到下载页面
          window.localStorage.setItem('download', '1') // 跳转download页面
          window.location.href = 'https://onecard.9fbank.com/static/activity/wk_activity/download.html'
        }
      })
      return false
    }
    // 初始化数据
    if (creditCardFlag) { // 打开信用卡
      window.localStorage.setItem('creditHeader', '1')
      this._initUserStatueCard()
    } else {
      window.localStorage.setItem('creditHeader', '0')
      setTimeout(() => {
        this._initUserStatue()
      }, 300)
    }
  }

  // 初始化授权项
  _initUserStatue () {
    let { api, userInfo, dentityInfo } = this.props.state
    let { updateToastMessage, fechUserPhoto, fetchUserStatus, fetchOneCardInfo } = this.props.actions
    fetchUserStatus()
    .then(() => {
      let { baseInfo, userStatus } = this.props.state.userInfo
      let { realNameStatus, hasPwd, zhimaStatus, operatorStatus, operatorStatusH5, bindCardStatus, isCustomerInfoExists, allExists, quotaAppStatus } = userStatus
      // 如果用户资质不符合，直接跳转到资质不符合页面
      if (baseInfo.qualifiCa == '0') {
        this.props.router.push('aptitudes')
      } else if (realNameStatus == 0 || hasPwd == 0) { // 实名
        this.props.router.push('/certification')
      } else if (bindCardStatus == 0) { // 绑卡
        this.props.router.push({pathname: 'bindCard', state: {loanType: 4}})
      } else if (operatorStatus == 0) { // 运营商
        if (operatorStatusH5 == 1) { // 运营商授权中状态
          if (zhimaStatus != '1') { // 芝麻未做
            let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/zhimaResult'
            // let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/transition'
            debugger
            console.log(callBackUrl)
            fetch({
              url: api.ZHIMA,
              data: {
                token: userInfo.baseInfo.token,
                callBackUrl
              }
            }).then(data => {
              if (data.status == 1) {
                console.log(data.data)
                debugger
                setTimeout(() => {
                  window.location.href = data.data
                }, 300)
              } else if (data.status == 1008) {
              } else {
                updateToastMessage(data.message)
              }
            })
            return false
          } else if (isCustomerInfoExists == 0 || allExists == 0) {
            if (dentityInfo.completeInfoFlag) { // 是否提交了个人信息（是）
              this.props.router.push('/upPhoto')
            } else {
              this.props.router.push('/completeInfo')
            }
          } else if ((isBlank(baseInfo.idCardPhotos) || baseInfo.idCardPhotos.length != 3 || quotaAppStatus == '4')) {
            this.props.router.push('/upPhoto')
          } else {
            // 初始化额度
            fetchOneCardInfo()
            .then(() => {
              let { cardQuota, freezeStatus } = this.props.state.oneCardInfo
              if (cardQuota > 0 && freezeStatus == 0) {
                 // 进入取现金页面
                this.props.router.push('/cashLoan')
              } else {
                // 进入资质不符页面
                this.props.router.push('/aptitudes')
              }
            })
          }
        } else { // 运营商未授权状态
          debugger
          let callBackUrl = window.location.origin + window.location.pathname + "#/"
          fechUserPhoto().then(() => {
            callBackUrl+= "transitionB" // 运营商回调地址为中转页面
            debugger
            console.log(callBackUrl)
            this.goOperator(callBackUrl)
          })
        }
      } else if (zhimaStatus != '1') {
        let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/zhimaResult'
        // let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/transition'
        debugger
        console.log(callBackUrl)
        fetch({
          url: api.ZHIMA,
          data: {
            token: userInfo.baseInfo.token,
            callBackUrl
          }
        }).then(data => {
          if (data.status == 1) {
            console.log(data.data)
            debugger
            setTimeout(() => {
              window.location.href = data.data
            }, 300)
          } else if (data.status == 1008) {
          } else {
            updateToastMessage(data.message)
          }
        })
        return false
      } else if (isCustomerInfoExists == 0 || allExists == 0) { // isCustomerInfoExists用户信息是否已经提交(0 未提交 1： 已提交) allExists(0:用户必填信息不完整 1：用户必填信息完整)
        if (dentityInfo.completeInfoFlag) { // 是否提交了个人信息（是）
          this.props.router.push('/upPhoto')
        } else {
          this.props.router.push('/completeInfo')
        }
      } else if ((isBlank(baseInfo.idCardPhotos) || baseInfo.idCardPhotos.length != 3 || quotaAppStatus == '4')) {
        this.props.router.push('/upPhoto')
      } else {
        // 初始化额度
        fetchOneCardInfo()
        .then(() => {
          // let { cardQuota, freezeStatus } = this.props.state.oneCardInfo
          // if (cardQuota > 0 && freezeStatus == 0) {
             // 进入取现金页面
          this.props.router.push('/cashLoan')
          // } else {
            // 进入资质不符页面
            // this.props.router.push('/aptitudes')
          // }
        })
      }
    })
  }

  // 初始化授权项(绑定信用卡)
  _initUserStatueCard () {
    let { api, userInfo, dentityInfo } = this.props.state
    let { updateToastMessage, fechUserPhoto, fetchUserStatus, fetchOneCardInfo } = this.props.actions
    fetchUserStatus()
    .then(() => {
      this.triggerUrl(this.props.state.userInfo)
      let { baseInfo, userStatus } = this.props.state.userInfo
      let { realNameStatus, hasPwd, zhimaStatus, operatorStatus, operatorStatusH5, bindCardStatus, creditStatus, isCustomerInfoExists, allExists, quotaAppStatus } = userStatus
      // 如果用户资质不符合，直接跳转到资质不符合页面
      if (baseInfo.qualifiCa == '0') {
        this.props.router.push('aptitudes')
      } else if (realNameStatus == 0 || hasPwd == 0) { // 实名
        this.props.router.push('/certification')
      } else if (bindCardStatus == 0) { // 绑卡
        this.props.router.push({pathname: 'bindCard', state: {loanType: 4}})
      } else if (operatorStatus == 0) { // 运营商
        if (operatorStatusH5 == 1) { // 运营商授权中状态
          if (creditStatus == 0 && window.localStorage.getItem('skipCredit') != '1') { // 信用卡未授权
          // } else if (creditStatus == 0) { // 信用卡未授权
            this.props.router.push('/creditcardList')
          } else if (zhimaStatus != '1') { // 芝麻
            let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/zhimaResult'
            console.log(callBackUrl)
            fetch({
              url: api.ZHIMA,
              data: {
                token: userInfo.baseInfo.token,
                callBackUrl
              }
            }).then(data => {
              if (data.status == 1) {
                setTimeout(() => {
                  window.location.href = data.data
                }, 300)
              } else if (data.status == 1008) {
              } else {
                updateToastMessage(data.message)
              }
            })
            return false
          } else if (isCustomerInfoExists == 0 || allExists == 0) {
            if (dentityInfo.completeInfoFlag) { // 是否提交了个人信息（是）
              this.props.router.push('/upPhoto')
            } else {
              this.props.router.push('/completeInfo')
            }
          } else if ((isBlank(baseInfo.idCardPhotos) || baseInfo.idCardPhotos.length != 3 || quotaAppStatus == '4')) {
            this.props.router.push('/upPhoto')
          } else {
            // 初始化额度
            fetchOneCardInfo()
            .then(() => {
              let { cardQuota, freezeStatus } = this.props.state.oneCardInfo
              if (cardQuota > 0 && freezeStatus == 0) {
                 // 进入取现金页面
                this.props.router.push('/cashLoan')
              } else {
                // 进入资质不符页面
                this.props.router.push('/aptitudes')
              }
            })
          }
        } else { // 运营商未授权状态
          let callBackUrl = window.location.origin + window.location.pathname + "#/"
          fechUserPhoto().then(() => {
            callBackUrl+= "transitionB" // 运营商回调地址为中转页面
            this.goOperator(callBackUrl)
          })
        }
      } else if (creditStatus == 0 && window.localStorage.getItem('skipCredit') != '1') { // 信用卡未授权
      // } else if (creditStatus == 0) { // 信用卡未授权
        this.props.router.push('/creditcardList')
      } else if (zhimaStatus != '1') { // 芝麻
        let callBackUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#/zhimaResult'
        console.log(callBackUrl)
        fetch({
          url: api.ZHIMA,
          data: {
            token: userInfo.baseInfo.token,
            callBackUrl
          }
        }).then(data => {
          if (data.status == 1) {
            setTimeout(() => {
              window.location.href = data.data
            }, 300)
          } else if (data.status == 1008) {
          } else {
            updateToastMessage(data.message)
          }
        })
        return false
      } else if (isCustomerInfoExists == 0 || allExists == 0) { // isCustomerInfoExists用户信息是否已经提交(0 未提交 1： 已提交) allExists(0:用户必填信息不完整 1：用户必填信息完整)
        if (dentityInfo.completeInfoFlag) { // 是否提交了个人信息（是）
          this.props.router.push('/upPhoto')
        } else {
          this.props.router.push('/completeInfo')
        }
      } else if ((isBlank(baseInfo.idCardPhotos) || baseInfo.idCardPhotos.length != 3 || quotaAppStatus == '4')) {
        this.props.router.push('/upPhoto')
      } else {
        // 初始化额度
        fetchOneCardInfo()
        .then(() => {
          // let { cardQuota, freezeStatus } = this.props.state.oneCardInfo
          // if (cardQuota > 0 && freezeStatus == 0) {
             // 进入取现金页面
          this.props.router.push('/cashLoan')
          // } else {
            // 进入资质不符页面
            // this.props.router.push('/aptitudes')
          // }
        })
      }
    })
  }

  render () {
    return (
      <ComposedComponent {...this.props} {...this.state} cashLoan = {this.cashLoan.bind(this)} />
    )
  }
}
