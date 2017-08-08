import * as constants from 'src/redux/types'
import _ from 'lodash'
const initialState = {
  toast: {
    message: ''
  },
  alert: {
    message: '',
    callBack () {
    }
  },
  twoBtnDialog: {
    leftBtnText: '知道啦',
    rightBtnText: '去下载',
    message: '',
    leftBtnFn: null,
    rightBtnFn () {}
  }
}
export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SHOWTOAST:
      const { toast } = action
      _.merge(state.toast, toast)
      return {
        ...state
      }
    case constants.SHOWALERT:
      const { alert } = action
      _.merge(state.alert, alert)
      return {
        ...state
      }
    case constants.SHOWTWOBTNDIALOG:
      const { dialog } = action
      _.merge(state.twoBtnDialog, dialog)
      return {
        ...state
      }
    default:
      return state
  }
}
