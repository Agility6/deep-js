/**
 * 1.Promise基础搭建
 * [[PromiseState]]: 三种状态
 * [[PromiseResult]]: 取决传入的值无则undefined
 * 状态改变一次则不会在改变(唯一性)
 */

// 验证p1状态
const p1 = new AgilityPromise((resolve, reject) => {

})
// [[PromiseState]] : "pending"
// [[PromiseResult]]: undefined
console.log(p1)

// 验证p2(resolve)状态
const p2 = new Promise((resolve, reject) => {
  resolve('p2 resolve')
})
// [[PromiseState]] : "fulfilled"
// [[PromiseResult]]: p2 resolve
console.log(p2)

// 验证p3(reject)状态
const p3 = new Promise((resolve, reject) => {
  reject('p3 reject')
})
// [[PromiseState]] : "rejected"
// [[PromiseResult]]: p2 resolve
console.log(p3)

// 验证p4(error)状态
const p4 = new Promise((resolve, reject) => {
  throw new Error('p4 Error') 
})
// [[PromiseState]] : "rejected"
console.log(p4)
 
// 验证p5 State
const p5 = new Promise((resolve, reject) => {
  resolve('p5 resolve')
  reject('p5 resolve')
})
console.log(p5)

/**
 * 2.then方法基础搭建
 */
const p6 = new Promise((resolve, reject) => {
  resolve('p6 resolve')
  reject('p6 reject')
})
p6.then(res => {
  console.log('res: ', res)
},err => {
  console.log('err: ', err)
})


/**
 * 3.then方法的优化
 */

// 验证p7的多次then调用
const p7 = new Promise((resolve, reject) => {
  resolve('p7 resolve')
  // reject('p7 reject')
})
p7.then(res1 => {
  console.log('res1: ', res1)
}, err1 => {
  console.log('err1: ', err1)
})

p7.then(res2 => {
  console.log('res2: ', res2)
}, err2 => {
  console.log('err2: ', err2)
})

// 验证p8的链式调用
const p8 = new Promise((resolve, reject) => {
  resolve('p8 resolve')
  // reject('p8 reject')

  // 在这里抛出异常
  // throw new Error('Error')
})
p8.then(res1 => {
  console.log('res1: ', res1)

  // 1.返回普通值
  // return '返回的Promise'

  // 2.抛出异常
  // throw new Error('Error')
}, err1 => {
  console.log('err1: ', err1)
}).then(res2 => {
  console.log('res2: ', res2)
}, err2 => {
  console.log('err2: ', err2)
})

// 验证p9在调用then方法時延时
const p9 = new Promise((resolve, reject) => {
  resolve('p9 resolve')
})

setTimeout(() => {
  p9.then(res => {
    console.log('res: ', res)
  }, err => {
    console.log('err: ', err)
  })
}, 1000)
