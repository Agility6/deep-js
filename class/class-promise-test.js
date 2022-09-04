import Mypromise from "./class-promise.js";

/**
 * log
 */
const log = date => type => message => {
  return `[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`
}
const nowLog = log(new Date())

/**
 * 状态唯一性
 */
const p = new Mypromise((resolve, reject) => {
  const message = nowLog("状态唯一性")("OK")
  resolve(message)
}).then(v => {
  console.log(v)
}, r => {
  console.log(r)
})
console.log(p)

console.log(nowLog("分割线")("- - - - -"))

/**
 * 异步调用
 */
const p2 = new Mypromise((resolve, reject) => {
  const message = nowLog("异步调用")("OK")
  setTimeout(() => {
    resolve(message)
  }, 1000)
})
setTimeout(() => {
  console.log(p)
}, 2000)

console.log(nowLog("分割线")("- - - - -"))

/**
 * all的使用  
 */
 const p3 = Promise.resolve(3);
 const p4 = 42;
 const p5 = new Promise((resolve, reject) => {
   setTimeout(resolve, 100, 'foo');
 });
 
 Promise.all([p3, p4, p5]).then((values) => {
   console.log(values);
 });
 // expected output: Array [3, 42, "foo"]

 /**
  * 暂时就做到这里了~
  * 😜
  */