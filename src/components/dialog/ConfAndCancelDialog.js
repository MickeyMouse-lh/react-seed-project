// 带两个按钮的弹框
import React, { Component } from 'react'
import { showTwoBtnAlert } from 'actions/'
import { connect } from 'react-redux'
// 将api绑定到props的api
const mapStateToProps = state => {
  return {
    dialog: state.dialog
  }
}
// action映射
const mapDispatchToProps = dispatch => {
  return {
    actions: {
      showTwoBtnAlert: (info) => dispatch(showTwoBtnAlert(info))
    }
  }
}
@connect(mapStateToProps, mapDispatchToProps)
export default class Alert extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  // 点击我知道啦
  _cancelBtn () {
    let { leftBtnFn } = this.props.dialog.twoBtnDialog
    let { showTwoBtnAlert } = this.props.actions
    leftBtnFn && leftBtnFn()
    showTwoBtnAlert({message: '', leftBtnFn: null, rightBtnFn: null})
  }
  // 点击去下载
  _confirmBtn () {
    let { showTwoBtnAlert } = this.props.actions
    let { rightBtnFn } = this.props.dialog.twoBtnDialog
    rightBtnFn && rightBtnFn()
    showTwoBtnAlert({message: '', leftBtnFn: null, rightBtnFn: null})
  }
  render () {
    let { twoBtnDialog } = this.props.dialog
    return (
      <div className="wherther">
         <p>{twoBtnDialog.message}</p>
         <div className="btnCom">
           <button className="btn" id="btnCancel" onClick={this._cancelBtn.bind(this)}>{twoBtnDialog.leftBtnText}</button>
           <i></i>
           <button className="btn" id="btnTrue" onClick={this._confirmBtn.bind(this)}>{twoBtnDialog.rightBtnText}</button>
          </div>
      </div>
    )
  }
}
