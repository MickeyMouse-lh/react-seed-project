// 初始化样式
import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

import routes from './router/'
import { store, history } from 'src/redux/'
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
)

console.log(12121)
