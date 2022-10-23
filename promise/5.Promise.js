/***
 * 在4.Promise会有大量的try catch处理那么我们可以抽取一下
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
    resolve(result)
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
    // 链式调用的关键就是获取上一次调用的结果,结果一定是Promise对象
    return new AgilityPromise((resolve, reject) => {

      // 1.当我们的状态为Pending就将方法放入对应的队列中
      if(this.status === PROMISE_STATUS_PENDING) {
        // 这里我们也需要拿到对应的返回结果,但是目前来说我们还做不到
        // this.onFulfilledFns.push(onFulfilled)
        // this.onRejectedFns.push(onRejected)
        
        // 因此需要换一种方式传入
        this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        this.onRejectedFns.push(() => {
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
}