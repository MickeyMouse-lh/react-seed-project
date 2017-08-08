import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'

/* containers */
import AppContainer from '../containers/App'

/* home page */
import Main from '../containers/Main'
import * as actions from 'actions/'
import { store } from 'src/redux/'

const showLoading = (nextState, replace) => {
  store.dispatch(actions.updateLoading(true))
}

const routes = (
  <Route path='/' component={AppContainer} history={browserHistory}>
    <IndexRoute component={ Main } onEnter={showLoading}/>
    { /*  <Route path='/register' component={Register}></Route> */}
    {/* <Route path='/registert' component={Registert}></Route> */}
  </Route>
)

export default routes
