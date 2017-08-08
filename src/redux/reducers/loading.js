import * as constants from '../types'

const initialState = {
  flag: true
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UPDATELOADING:
      let { loading } = action
      state.flag = loading
      return {
        ...state
      }
    default:
      return state
  }
}
