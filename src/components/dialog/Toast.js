// toast弹框
import React, { Component } from 'react'
import { connect } from 'react-redux'
function mapStateToProps (state) {
  return {
    state: {
      toast: state.dialog.toast
    }
  }
}
@connect(mapStateToProps, null)
export default class Toast extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let { toast } = this.props.state
    return (
      <div className="m9fDialog"><div className="m9fDialog-wrap">{toast.message}</div></div>
    )
  }
}
