/**
 * 2.then方法基础搭建
 */

// 定义三种状态
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 创建Promise类
class AgilityPromise {
  constructor(executor) {
    // 定义默认状态
    this.status = PROMISE_STATUS_PENDING
    // 定义resolve的默认值
    this.value = undefined
    // 定义reject默认的值
    this.reason = undefined

    // resolve方法
    const resolve = value => {
      // 判断当前状态
      if(this.status === PROMISE_STATUS_PENDING) {
        // 更新状态
        this.status = PROMISE_STATUS_FULFILLED
        // 微任务执行
        queueMicrotask(() => {
          // 更新传入值
          this.value = value
          // 调用onFulfilled
          this.onFulfilled(this.value)
        })
      }
    }

    // reject方法
    const reject = reason => {
      // 判断当前状态
      if(this.status === PROMISE_STATUS_PENDING) {
        // 更新状态
        this.status = PROMISE_STATUS_REJECTED
        // 微任务执行
        queueMicrotask(() => {
          // 更新传入值
          this.reason = reason
          // 调用onFulfilled
          this.onRejected(this.reason)
        })
      }
    }

    // 执行executor中的callback
    executor(resolve, reject)
  }
  
  // 编写then方法
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}