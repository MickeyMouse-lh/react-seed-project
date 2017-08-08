// 全局遮罩
import React, { Component } from 'react'
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
export default class Loading extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <section className="loadWrap">
        <div className="loading">
          <img src={require('icon/loading.gif')}/>
        </div>
      </section>
    )
  }
}
