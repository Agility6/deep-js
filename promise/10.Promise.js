/**
 * 6.all和allSettled
 */

// 定义三种状态
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

/**
 * 
 * @param {*} execFn 需要执行的函数
 * @param {*} value 传入的值
 * @param {*} resolve 成功的回调
 * @param {*} reject 失败的回调
 */
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    // 对result的结果进行判断是否为Promise
    if(result instanceof AgilityPromise) {
      // 是为Promise直接调用then方法就可以了
      result.then( v => {
        resolve(v)
      }, err => {
        reject(err)
      })
    } else {
      // 不是直接调用resolve方法
      resolve(result)
    }
  } catch(err) {
    reject(err)
  }
}

// 创建Promise类
class AgilityPromise {
  constructor(executor) {
    // 定义默认状态
    this.status = PROMISE_STATUS_PENDING
    // 定义resolve的默认值
    this.value = undefined
    // 定义reject默认的值
    this.reason = undefined
    // 定义fulfilled的方法队列
    this.onFulfilledFns = []
    // 定义rejected的方法队列
    this.onRejectedFns = []

    // resolve方法
    const resolve = value => {
      // 判断当前状态
      if(this.status === PROMISE_STATUS_PENDING) {
        // 微任务执行
        queueMicrotask(() => {
          // 判断当前状态是否是Pending
          if(this.status !== PROMISE_STATUS_PENDING) return
          // 更新状态
          this.status = PROMISE_STATUS_FULFILLED
          // 更新传入值
          this.value = value
          // 遍历onFulfilledFns执行fn
          this.onFulfilledFns.forEach( fn => {
            fn(this.value)
          })
        })
      }
    }

    // reject方法
    const reject = reason => {
      // 判断当前状态
      if(this.status === PROMISE_STATUS_PENDING) {
        // 微任务执行
        queueMicrotask(() => {
          // 判断当前状态是否是Pending
          if(this.status !== PROMISE_STATUS_PENDING) return
          // 更新状态
          this.status = PROMISE_STATUS_REJECTED
          // 更新传入值
          this.reason = reason
          // 遍历onRejectFns执行fn
          this.onRejectedFns.forEach( fn => {
            fn(this.reason)
          } )
        })
      }
    }

    // 捕获异常
    try {
      // 执行executor中的callback
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }
  
  // 编写then方法
  then(onFulfilled, onRejected) {
  
    // 判断onRejected是否为空,为空将错误传递到下面
    onRejected = onRejected || (err => { throw err })

    // 和catch一样没有resolve处理的话就将值返回出去
    onFulfilled = onFulfilled || (value => { return value })

    // 链式调用的关键就是获取上一次调用的结果,结果一定是Promise对象
    return new AgilityPromise((resolve, reject) => {

      // 1.当我们的状态为Pending就将方法放入对应的队列中
      if(this.status === PROMISE_STATUS_PENDING) {
        // 这里我们也需要拿到对应的返回结果,但是目前来说我们还做不到
        // this.onFulfilledFns.push(onFulfilled)
        // this.onRejectedFns.push(onRejected)
        
        // 因此需要换一种方式传入
       if(onFulfilled) this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        if(onRejected) this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })

      }

      // 2.当我们的状态不为Pending的时候并且callback有值时，直接执行
      // 这是因为不为Pending说明状态发生了改变可以直接执行对应的callback
      if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if(this.status === PROMISE_STATUS_REJECTED && onRejected) {
        execFunctionWithCatchError(onRejected, this.value, resolve, reject)
      }
    })
  }

  /**
   * catch方法
   * 直接调用then方法，将onFulfilled传入undefined
   * 
   * 思考一下：
   *  什么时候会执行catch?是不是当reject/throw err時，当前的.then没有处理
   *  所以我们只需要拿到上一个promise返回的err值就行了
   *  因此再then前面我们判断
   *    - 当前onRejected是否为空 --> 代表没有对当前Promise的err做处理
   *    - 将当前的err直接 throw 出去 --> 再前面我们知道当 throw err的时候就会调用失败的回调
   * @param {*} onRejected 
   */
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * finally的实现
   * @param {*} onFinally 
   */
  finally(onFinally) {
    // 比较简单我们直接去调用then方法将onFinally传入到then中
    // 不管是失败还是成功都是需要传入的
    this.then(() => {
      onFinally()
    }, () => {
      onFinally()
    })
  }

  // 定义resolve静态方法
  static resolve(value) {
    return new AgilityPromise(resolve => resolve(value))
  }

  // 定义reject静态方法
  static reject(reason) {
    return new AgilityPromise((resolve,reject) => reject(reason))
  }

  // 定义all静态方法
  static all(promises) {
    // 返回一个promise对象
    return new AgilityPromise((resolve, reject) => {
      // 存储传入的结果
      const resultArr = []
      promises.forEach((promise, index) => {
        // 判断是否为AgilityPromise对象
        if(promise instanceof AgilityPromise) {
          promise.then(res => {
            // 通过index的指针方式存入 如果使用push那么无法保证在异步的时候能正确的位置存入
            resultArr[index] = res
            // 判断是否全部合格，则返回resolve
            if(resultArr.length === promises.length) resolve(resultArr)
          }, err => {
            reject(err)
          })
        } else {
          resultArr[index] = promise
          if(resultArr.length === promises.length) resolve(resultArr)
        }
      })
      
    } )
  }

  // 定义allSettled静态方法
  static allSettled(promises) {
    return new AgilityPromise((resolve, reject) => {
      const result = []
      promises.forEach((promise, index) => {
        let resultObj = {}
        promise.then(res => {
          resultObj.status = 'fulfilled'
          resultObj.value = res
          result[index] = resultObj
          if(result.length === promises.length) resolve(result)
        }, err => {
          resultObj.status = 'rejected'
          resultObj.reason = err
          result[index] = resultObj
          if(result.length === promises.length) resolve(result)
        })
      })
    }) 
  }

  // 定义race静态方法
  static race(promises) {
    return new AgilityPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve,reject)
      })
    })
  }

  // 定义any静态方法
  static any(promises) {
    return new AgilityPromise((resolve, reject) => {
      const result = []
      promises.forEach((promise,index) => {
        promise.then(res => {
          resolve(res)
        }, err => {
          result[index] = err
          if(result.length === promises.length) {
            reject('All promises were rejected')
          }
        })
      })
    })
  }
}


const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('okk')
    reject('p1 err')
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p2 okk')
    // reject('p2 err')
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p3 okk')
    reject('p3 err')
  }, 3000)
})

Promise.any([p1,p2,p3]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})