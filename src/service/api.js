import axios from 'axios';
import querystring from 'querystring'

let api = {};

axios.defaults.baseURL = 'http://www.gonever.com';
if (localStorage.getItem("AUTH_TOKEN")) {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem("AUTH_TOKEN");
}

api.post = function (uri, data = {}) {
  return axios.post(uri, querystring.stringify(data)).catch(function (error) {
    alert(error)
  })
};

api.get = function (uri, data = {}) {
  let param = querystring.stringify(data);
  uri = param ? uri + "?" + param:uri;
  return axios.get(uri).catch(function (error) {
    alert(error)
  })
};

export default api



