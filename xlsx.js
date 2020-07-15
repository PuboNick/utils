import xlsx from 'xlsx';

function s2ab(s) { //字符串转字符流
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
};
/**
 * @desc 导出数据
 * @param {*} data 
 * @param {*} type 
 */
function exportTable(data, type) {
  let tmpWB = null;
  for (let title in data) {
    data[title].unshift(readDataHead(data[title]));
    let tmpdata = format2Sheet(data[title]);
    tmpWB = format2WB(tmpdata, title, tmpWB);
  }
  return format2Blob(tmpWB, type);
};
/**
 * 将指定的自然数转换为26进制表示,映射关系：[0-25] -> [A-Z]
 * @param {*} n 
 */
function getCharCol(n) {
  let s = '';
  let m = 0;
  while (n > 0) {
    m = n % 26 + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26;
  }
  return s;
};
/**
 * 从数据数组或对象中根据key生成相同key值的对象
 * @param {Object|Array} data 
 * @return {Object}
 */
function readDataHead(data) {
  let o = {};
  let d = data;
  if (Array.isArray(data)) d = Object.keys(data[0]);
  for (let i of d) o[i] = i;
  return o;
};
/**
 * @desc 格式化数据为Sheet格式
 * @param {Array} json 数据
 * @param {Number} n 列偏移
 * @param {Number} r 行偏移
 * @param {Array} keyMap 对象键数组
 * @param {Function|Boolean} t 数据
 */
function format2Sheet(json, n, r, keyMap, t) {
  keyMap = keyMap || Object.keys(json[0]);
  let types = (t === undefined ? ((v) => (({ "number": "n", undefined: "s", "boolean": "b","string":"s" })[typeof v])||"s") : t);
  n = n || 0;
  r = r || 0;
  let tmpdata = {};//用来保存转换好的json 
  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    v: v[k],
    position: ((j + n) > 25 ? getCharCol((j + n)) : String.fromCharCode(65 + (j + n))) + (i + 1 + r),
  }))).reduce((prev, next) => prev.concat(next)).forEach(v => tmpdata[v.position] = {
    v: v.v,
    t: types?types(v.v):"s"
  });
  return tmpdata;
};
/**
 * @desc 格式化数据为Sheet格式
 * @param {Array} sheetData 
 * @param {String} title 
 * @param {Object} wb 
 * @param {Object} ref
 */
function format2WB(sheetData, title, wb, ref) {
  let outputPos = Object.keys(sheetData);
  title = title || "mySheet";
  if (!wb) wb = { Sheets: {}, SheetNames: [] };
  wb.SheetNames.push(title);
  wb.Sheets[title] = Object.assign({}, sheetData, {
    '!ref': ref || (outputPos[0] + ':' + outputPos.reverse().find(_=>_.indexOf("!") === -1))//设置填充区域
  });
  return wb;
};
/**
 * @desc 将xlsx Workbook 转为blob
 * @param {Array} wb 
 * @param {String} type 类型
 */
function format2Blob(wb, type) {
  /* 这里的数据是用来定义导出的格式类型 */
  let option = { bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary' };
  return new Blob([s2ab(xlsx.write(wb, option))], { type: "" });
};
/**
 * @desc 创建下载连接，并下载
 * @param {String} url 下载地址 
 * @param {String} name 文件保存名
 */
function saveAs(url, name) {
  let link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.style.position = 'fixed';
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
/**
 * @description 将数组转为对象
 * @param {String} item 数据对象
 * @param {Array} titles 表头
 */
function setObj(item, titles) {
  let colum = {};
  titles.forEach(title => colum[title.name] = item[title.value] || '');
  return colum;
}
/**
 * @desc 导出json数据为表格
 * @param {String} fileName 导出文件名
 * @param {String} sheetName 工作簿名
 * @param {Array} values 数据
 * @param {Array} titles 表头数据
 */
export function jsonToExcel({ fileName = 'download.xlsx', sheetName = 'Sheet1', values = [], titles = [] }){
  let data = [];
  let res = {};
  values.forEach(item => data.push(setObj(item, titles)));
  if (values.length >  0) data.push(setObj({}, titles));
  res[sheetName] = data;
  saveAs(URL.createObjectURL(exportTable(res)), fileName);
};
/**
 * @description Excel 導入
 * @param {File} file 文件對象
 * @param {Array} dicList 鍵名對象列表 [{ name: '' , key: ''}]
 * @returns {Array} Promise 參數爲轉換結果列表
 */
export const excel2json = (file, dicList) => {
  const option = {
    type: 'binary'
  };
  const parseFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsBinaryString(file);
  };
  const file2binary = file => {
    return new Promise((resolve) => parseFile(file, resolve));
  };
  const mapData = item => {
    let res = { key: random() };
    dicList.forEach(dic => res[dic.key] = item[dic.name]);
    return res;
  };
  const wb2Json = (wb) => {
    const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return data.map(mapData);
  };
  return file2binary(file).then(binary => wb2Json(xlsx.read(binary, option)));
};