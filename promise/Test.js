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
// [[PromiseResult]]: p3 reject
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

  // 3.return一个Promise
  new Promise((resolve, reject) => { resolve('return Promise resolve') })
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

/**
 * 4.catch方法实现
 */

// 验证p10的catch方法

const p10 = new Promise((resolve, reject) => {
  reject('p10 resolve')
})

p10.then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

/**
 * 5.finally方法的实现
 */

// 验证p11的finally方法
const p11 = new Promise((resolve, reject) => {
  resolve('p11 resolve')
})

p11.then(res1 => {
  console.log('res1: ', res1)
}).then(res2 => {
  console.log('res2: ', res2)
  throw new Error('err')
}).catch(err => {
  console.log('err: ', err)
}).finally(() => {
  console.log('我是finally')
})

// 验证p12的finally方法 情况二
const p12 = new Promise((resolve, reject) => {
  resolve('p12 resolve')
})

p12.then(res => {
  console.log('res: ', res)
  return '1'
}).catch(err => {
  console.log('err: ', err)
}).finally(() => {
  console.log('我是finally')
})

/**
 * 6.resolve和reject方法
 */

// 验证resolve静态方法
Promise.resolve('OK').then((res) => {
  console.log(res)
})

// 验证reject静态方法
Promise.reject('err').catch(err => {
  console.log(err)
})

/**
 * 7.实现all和allSettled
 */

// 全部正确返回情况
const p13 = Promise.resolve('p13')
const p14 = Promise.resolve('p14')
const p15 = Promise.resolve('p15')

Promise.all([p13,p14,p15]).then(res => {
  console.log('all promise: ', res)
}).catch(err => {
  console.log('all promise: ', err)
})
// 打印的顺序调换
// Promise.all([p15,p14,p13]).then(res => {
//   console.log('all promise: ', res)
// }).catch(err => {
//   console.log('all promise: ', err)
// })

// 延迟返回
const p16 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p16')
  }, 1000)
})

const p17 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p17')
  }, 2000)
})

const p18 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p18')
  }, 3000)
})

Promise.all([p16,p17,p18]).then(res => {
  console.log('all promise: ', res)
}).catch(err => {
  console.log('all promise: ', err)
})

// 中间有错误的情况
const p19 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p19')
  }, 1000)
})

const p20 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('err p20')
  }, 2000)
})

const p21 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p21')
  }, 3000)
})

Promise.all([p19,p20,p21]).then(res => {
  console.log('all promise: ', res)
}).catch(err => {
  console.log('all promise: ', err)
})

// allSettled方法的验证
const p22 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p1~ok')
    reject('p22~err')
  }, 1000)
})

const p23 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p2~ok')
    reject('p23~err')
  }, 2000)
})

const p24 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p3~ok')
    reject('p24~err')
  }, 3000)
})

Promise.allSettled([p22,p23,p24]).then(res => {
  console.log('res: ', res)
})


/**
 * 8.实现race和any方法
 */

// race
const p25 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("p1 resolve")
    reject("p25 reject error")
  }, 3000)
})

const p26 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p26 resolve")
    // reject("p2 reject error")
  }, 2000)
})

const p27 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p27 resolve")
  }, 5000)
})

Promise.race([p25,p26,p27]).then(res => {
  console.log('race promise', res)
}).catch(err => {
  console.log("race promise err:", err)
})

// any

const p28 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('okk')
    reject('p28 err')
  }, 1000)
})

const p29 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p29 okk')
    // reject('p2 err')
  }, 2000)
})

const p30 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p3 okk')
    reject('p30 err')
  }, 3000)
})

Promise.any([p28,p29,p30]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})