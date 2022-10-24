/**
 * 手写Promise
 * 遵循PromiseA+规范
 * https://promisesaplus.com/
 */

/**
 * 
 * @param {*} execFn 
 * @param {*} value 
 * @param {*} resolve 
 * @param {*} reject 
 */
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    if(result instanceof AgilityPromise) {
      result.then( v => {
        resolve(v)
      }, err => {
        reject(err)
      })
    } else {
      resolve(result)
    }
  } catch(err) {
    reject(err)
  }
}

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
        queueMicrotask(() => {
          if(this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          this.onFulfilledFns.forEach( fn => {
            fn(this.value)
          })
        })
      }
    }

    const reject = reason => {
      if(this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if(this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          this.onRejectedFns.forEach( fn => {
            fn(this.value)
          } )
        })
      }
    }

    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    return new AgilityPromise((resolve, reject) => {
      if(this.status === PROMISE_STATUS_PENDING) {
        this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
  
      if(this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if(this.status === PROMISE_STATUS_REJECTED && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      }
    })
  }
}


let p = new AgilityPromise((resolve , reject) => {
  // 异步操作
  setTimeout(() => {
    resolve('OK')
  },1000)
}) 

p.then(value => {
  console.log(value)
},reason => {
  console.log(reason)
})

console.log(p)