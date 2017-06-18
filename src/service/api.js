import axios from 'axios';
import querystring from 'querystring'

let api = {};

axios.defaults.baseURL = 'https://git.gonever.com';
if (localStorage.getItem("AUTH_TOKEN")) {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
}

api.post = function (uri, data = {}) {
  return axios.post(uri, querystring.stringify(data)).catch(function (error) {
    alert(error);
  });
};

api.get = function (uri, data = {}) {
  let param = querystring.stringify(data);
  uri = param ? uri + "?" + param : uri;
  return axios.get(uri).catch(function (error) {
    alert(error);
  });
};

api.file = function (uri, data = {}) {
  let getFormData = object => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
  return axios.post(uri, getFormData(data)).catch(function (error) {
    alert(error);
  });
};

export default api



