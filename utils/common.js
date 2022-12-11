import { SERVER_ERROR_MESSAGE } from './constants.mjs'

export const catchAndToastError = (that) => (err) => {
  that.$store.commit('finishLoading')
  let message = SERVER_ERROR_MESSAGE
  if (err.response?.data?.errMessage) {
    message = err.response?.data?.errMessage
  }
  that.$toast.error(message)
}
