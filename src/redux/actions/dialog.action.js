import * as constants from 'src/redux/types'

export function showToast (toast) {
  return {
    type: constants.SHOWTOAST,
    toast
  }
}
export function showAlert (alert) {
  return {
    type: constants.SHOWALERT,
    alert
  }
}
export function showTwoBtnAlert (dialog) {
  return {
    type: constants.SHOWTWOBTNDIALOG,
    dialog
  }
}
