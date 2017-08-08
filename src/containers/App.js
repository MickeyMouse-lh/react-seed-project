import React, { Component } from 'react'
import Dialog from 'components/dialog/'
import Loading from 'components/Loading/'
import { connect } from 'react-redux'
// 将api绑定到props的api
const mapStateToProps = state => {
  return {
    state: {
      loading: state.loading
    }
  }
}
@connect(mapStateToProps, null)
export default class App extends Component {
  render () {
    let { flag } = this.props.state.loading
    return (
      <div className='AppContainer'>
        <Dialog/>
        {
          flag? <Loading/>: ''
        }
        <div className='wrap'>{this.props.children}</div>
      </div>
    )
  }
}
