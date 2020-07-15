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
/**
 * @description 去除首尾空格
 */
export const trim = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * @description base64轉blob
 */
export const base642blob = (dataURI) => {
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  let byteString = atob(dataURI.split(",")[1]);
  let arrayBuffer = new ArrayBuffer(byteString.length);
  let intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  let blob = new Blob([intArray], { type: mimeString });
  return { blob, type: mimeString };
};
/**
 * @description blob轉base64
 */
export const blob2base64 = (blob) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    if (!blob) return reject('文件爲空!');
    reader.onload = function (e) {
      resolve(e.target.result);
    };
    reader.onabort = function() {
      reject();
    }
    reader.readAsDataURL(blob);
  });
};
/**
 * @description blob轉file
 * @param {} data
 */
export const blob2file = (blob, name, type) => {
  return new File(blob, name, { type });
};
/**
 * @description base64轉file
 * @param {dataurl} dataURI base64數據
 * @param {string} name 文件名
 */
export const base642file = (dataURI, name) => {
  let { blob, type } = base642blob(dataURI);
  if (!name) name = `${random()}.${type.split("/")[1]}`;
  return blob2file([blob], name, type);
};
/**
 * @description 對象轉FormData
 */
export const obj2form = (data) => {
  let results = new FormData();
  for (const index of Object.keys(data)) {
    results.append(index, data[index]);
  }
  return results;
};
/**
 * @description 獲取某個對象裡的幾個屬性並返回新的對象
 * @param {Object} obj 原始對象
 * @param {Array} keys 鍵名列表
 */
export const getItemsFormObj = (obj, keys) => {
  let result = {};
  for(let key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}
/**
 * 判斷一個值是否爲對象
 * @param obj 任意值
 */
export const isObj = (obj) => {
  return (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
};
/**
 * 複製一個普通對象
 * @param obj 對象
 */
export const clone = (obj) => {
  let cloneObj;
  let Constructor = obj.constructor;
  if (Constructor === RegExp) {
    cloneObj = new Constructor(obj);
  } else if (Constructor === Date) {
    cloneObj = new Constructor(obj.getTime());
  } else {
    cloneObj = new Constructor();
  }
  for (let key in obj) {
    cloneObj[key] = isObj(obj[key]) ? clone(obj[key]) : obj[key];
  }
  return cloneObj;
};