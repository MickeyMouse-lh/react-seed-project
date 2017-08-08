import React, { Component } from 'react'
import { connect } from 'react-redux'
import { showAlert } from 'actions/'
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
      showAlert: (flag) => dispatch(showAlert(flag))
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
  _confirmBtn () {
    let { showAlert } = this.props.actions
    let { callBack } = this.props.dialog.alert
    callBack()
    showAlert({message: ''})
  }
  render () {
    let { message } = this.props.dialog.alert
    return (
      <div className="alert"><p>{message}</p><span className="btn" onClick={this._confirmBtn.bind(this)}>知道了</span></div>
    )
  }
}
