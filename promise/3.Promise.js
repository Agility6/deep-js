/**
 * 3.then方法的优化
 * 通过 test p7 和 p9
 * 
 * 
 * 问题：
 *  当我们把更新状态放在微任务前面就会导致then判断状态出错
 *  当我们把更新状态放在微任务当中就会导致更新状态的时间不正确
 *    在resolve/reject同时存在都会执行(违背)
 * 因此要在执行微任务之前去判断一下如果当前状态不为Pending就直接return
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

    // 执行executor中的callback
    executor(resolve, reject)
  }
  
  // 编写then方法
  then(onFulfilled, onRejected) {
    // 将获取的onFulfilled方法和onRejected方法添加到执行队列当中
    // 因为在测试p10当中我们使用了setTimeout去延迟调用then方法
    // 导致在push時并没有将我们进行延迟的方法加入到队列中

    // 1.当我们的状态为Pending就将方法放入对应的队列中
    if(this.status === PROMISE_STATUS_PENDING) {
      this.onFulfilledFns.push(onFulfilled)
      this.onRejectedFns.push(onRejected)
    }

    // 2.当我们的状态不为Pending的时候并且callback有值时，直接执行
    // 这是因为不为Pending说明状态发生了改变可以直接执行对应的callback
    if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
      onFulfilled(this.value)
    }
    if(this.status === PROMISE_STATUS_REJECTED && onRejected) {
      onRejected(this.reason)
    }
  }
}