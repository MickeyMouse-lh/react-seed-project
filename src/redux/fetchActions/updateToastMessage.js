// 更新toast框信息

import * as actions from 'actions/'

export function updateToastMessage ({message, callBack}) {
  return (dispatch, getState) => {
    dispatch(actions.showToast({message}))
    setTimeout(() => {
      dispatch(actions.showToast({message: ''}))
      callBack && callBack()
    }, 2000)
  }
}
