import axios from "axios";

let config = {
  model: 'development',
  baseUri: ''
};

/**
 * @description 返回值處理
 * @param {object} response 返回對象
 */
const resolve = response => {
  let res = response.data;
  if (res.code && res.code === "200") return res.data;
  if (res.code && res.code !== "200") return Promise.reject(res.msg);
  return response.data;
};
/**
 * @description 打印错误
 * @param {Object} err 错误对象
 */
const logErr = err => {
  let response = err.response;
  let config = err.config;
  let { params, data, headers } = config;
  console.log({ ...response.data, params, data, headers });
}
/**
 * @description 異常處理
 * @param {object} err 錯誤對象
 */
const reject = err => {
  let response = err.response;
  if (config.model === "development" && response) logErr(err);
  return Promise.reject("網絡連接失敗");
};
/**
 * @description 设置axios基本配置
 */
void function() {
  axios.interceptors.response.use(resolve, reject);
  axios.defaults.baseURL = config.baseUri;
}();
