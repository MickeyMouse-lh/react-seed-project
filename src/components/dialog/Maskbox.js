// 遮罩
import React, { Component } from 'react'

export default class Alert extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div className="maskbox alert_mask"></div>
    )
  }
}
