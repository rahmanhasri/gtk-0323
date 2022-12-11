export default function({ $axios }) {
  $axios.onError((error) => {
    return error.response ? Promise.reject(error.response.data) : Promise.reject(error);
  })
}
