import { hashHistory } from 'react-router'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import useScroll from 'scroll-behavior/lib/useStandardScroll'
import thunk from 'redux-thunk'
import * as reducers from 'reducers/'
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

export const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ))
const scrollHistory = useScroll(() => hashHistory)()
export const history = syncHistoryWithStore(scrollHistory, store)
