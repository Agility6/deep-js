/**
 * 手写Promise
 * 遵循PromiseA+规范
 * https://promisesaplus.com/
 */

const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

class AgilityPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []
    
    const resolve = value => {
      if(this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_FULFILLED
        queueMicrotask(() => {
          this.value = value
          this.onFulfilledFns.forEach( fn => {
            fn(this.value)
          })
        })
      }
    }

    const reject = reason => {
      if(this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_REJECTED
        queueMicrotask(() => {
          this.reason = reason
          this.onRejectedFns.forEach( fn => {
            fn(this.value)
          } )
        })
      }
    }

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    this.onFulfilledFns.push(onFulfilled)
    this.onRejectedFns.push(onRejected)
  }
}