// 弹框组件
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Alert from 'components/dialog/Alert'
import Maskbox from 'components/dialog/Maskbox'
import Toast from 'components/dialog/Toast'
import ConfAndCancelDialog from 'components/dialog/ConfAndCancelDialog'

const mapStateToProps = state => {
  return {
    dialog: state.dialog
  }
}
@connect(mapStateToProps, null)
export default class Dialog extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let { alert, toast, twoBtnDialog } = this.props.dialog
    return (
      <div className="dialog">
        {
          alert.message != ''? <Alert/> : ''
        }
        {
          (alert.message != '' || twoBtnDialog.message != '')? <Maskbox/> : ''
        }
        {
          toast.message != ''? <Toast/>: ''
        }
        {
          twoBtnDialog.message != ''? <ConfAndCancelDialog/>: ''
        }
      </div>
    )
  }
}
