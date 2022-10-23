/**
 * 1.Promise基础搭建
 * [[PromiseState]]: 三种状态
 * [[PromiseResult]]: 取决传入的值无则undefined
 * 状态改变一次则不会在改变(唯一性)
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
        // 更新传入值
        this.value = value
      }
    }

    // reject方法
    const reject = reason => {
      // 判断当前状态
      if(this.status === PROMISE_STATUS_PENDING) {
        // 更新状态
        this.status = PROMISE_STATUS_REJECTED
        // 更新传入值
        this.reason = reason
      }
    }

    // 执行executor中的callback
    executor(resolve, reject)
  }

}