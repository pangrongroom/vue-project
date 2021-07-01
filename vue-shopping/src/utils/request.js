import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((req) => {
  return req
})
axios.interceptors.response.use((res) => {
  return res
})

let map = new Map()
map.set('get', get)
map.set('post', post)
map.set('delete', del)
map.set('put', put)

function request(options) {
  if (!options.type || !map.get(options.type)) {
    return new Promise((v) => {
      v('没有这种请求方法')
    })
  }
  return map.get(options.type)(options)
}
function get(options) {
  return axios.get(options.url, { params: options.data })
}
function del(options) {
  return axios.delete(options.url, { params: options.data })
}

function post(options) {
  return axios.post(options.url, options.data)
}

function put(options) {
  return axios.put(options.url, options.data)
}

export default request
