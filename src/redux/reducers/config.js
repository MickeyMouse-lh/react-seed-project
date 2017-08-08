// 接口列表
import initialState from 'state/config.data'
import * as constants from '../types'

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UPDATECONFIG:
      let { config } = action
      return {
        ...state,
        ...config
      }
    default:
      return state
  }
}
