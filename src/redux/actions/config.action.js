// config actions
import * as constants from 'src/redux/types'

export function updateConfig (config) {
  return {
    type: constants.UPDATECONFIG,
    config
  }
}
