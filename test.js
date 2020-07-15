const getItemsFormObj = (obj, keys) => {
  let result = {};
  for(let key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}
let obj = {
  a: 'hello world',
  b: 'test',
  d: {
    hello: 'wold'
  }
}

let keys = ['a', 'd'];

console.log(getItemsFormObj(obj, keys))