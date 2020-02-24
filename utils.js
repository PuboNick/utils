/**
 * @description 生成一個長度爲8的隨機數
 */
export const random = () => Math.random().toString(32).slice(2, 10);
/**
 * @description 轉換日期
 * @param {string|date} date 日期對象或者日期格式字符串
 */
export const dateparse = (date, format = '-') => {
  if (!date) return "";
  let dateObj = new Date(date);
  let year = padStart(dateObj.getFullYear());
  let month = padStart(dateObj.getMonth() + 1);
  let date = padStart(dateObj.getDate())
  return `${year}${format}${month}${format}${date}`;
};
/**
 * @description 轉換時間
 * @param {string|date} date 日期對象或者日期格式字符串
 */
export const timeparse = date => {
  if (!date) return "";
  let dateObj = new Date(date);
  let hour = padStart(dateObj.getHours());
  let minite = padStart(dateObj.getMinutes());
  let second = padStart(dateObj.getSeconds())
  return `${hour}:${minite}:${second}`;
};
/**
 * @description 日期時間轉換
 * @param {string|date} date 日期對象或者日期格式字符串
 */
export const datetimeParse = (date, format) => {
  return `${dateparse(date, format)} ${timeparse(date)}`;
};
/**
 * 字符串補全
 * @param {string} str 原字符串或能準換爲字符串的值
 * @param {*} length 補全長度
 * @param {*} value 補全值
 */
export const padStart = (str, length = 2, value = "0") => {
  if (str.toString().length < length) str = `${value}${str}`;
  return str;
};
/**
 * @description 判断文件是否为图片
 * @param {string} name 文件名
 */
export const isImg = name => {
  const types = [".png", ".jpg"];
  for (let i = 0; i < types.length; i++) {
    if (name.includes(types[i])) return true;
  }
  return false;
};
/**
 * @description 下载文件
 * @param {string} uri 文件地址
 * @param {string} name 文件名
 */
export const downloadFile = (uri, name) => {
  let a = document.createElement("a");
  a.href = uri;
  a.download = name;
  a.style.position = 'fixed';
  a.style.visibility = 'hidden';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
/**
 * @description 去抖方法
 * @param {function} func 方法
 * @param {number} 等待时间
 */
export const debounce = (func, wait) => {
  let timeout;
  return function() {
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
/**
 * @deprecated 保留N位小数
 * @param {number} num 原数字
 * @param {number} n 小数位数
 */
export const fixNum = (num = 0, n = 1) => {
  if (num === 0) return 0;
  const i = Math.pow(10, n);
  return Math.round(num * i) / i;
};
/**
 * @description 全屏顯示
 */
export const full = ele => {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
};
/**
 * @description 退出全屏顯示
 */
export const exitFullscreen = () => {
  if(document.exitFullScreen) {
    document.exitFullScreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
