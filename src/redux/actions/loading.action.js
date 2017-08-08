// config actions
import * as constants from 'src/redux/types'

export function updateLoading (loading) {
  return {
    type: constants.UPDATELOADING,
    loading
  }
}
