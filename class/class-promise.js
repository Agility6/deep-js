const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}
class Mypromise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    
    this.callbacks = []

    const resolve = value => {
      if (this.status !== STATUS.PENDING) return
      this.status = STATUS.FULFILLED
      this.value = value
      this.callbacks.forEach(item => {
        item.onResolved(value)
      })
    }

    const reject = reason => {
      if (this.status !== STATUS.PENDING) return
      this.status = STATUS.REJECTED
      this.value = reason
      this.callbacks.forEach(item => {
        item.onRejected(reason)
      })
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onResolved, onRejected) {

    if (typeof onRejected !== 'function') {
      onRejected = reason => {
        throw reason
      }
    }
    if (typeof onResolved !== 'function') {
      onResolved = value => value
    }

    return new Mypromise((resolve, reject) => {

      const callback = type => {
        try {
          let result = type(this.value)
          if(result instanceof Promise) {
            result.then(v => {
              resolve(v)
            }, r => {
              reject(r)
            })
          } else {
            resolve(result)
          }
        } catch(e) {
          reject(e)
        }
      }  


      if (this.status === STATUS.FULFILLED) {
        callback(onResolved)
    }
      if (this.status === STATUS.REJECTED) {
        callback(onRejected)
      }

      if (this.status === STATUS.PENDING) {
        this.callbacks.push({
          onResolved: function() {
            callback(onResolved)
          },
          onRejected: function() {
            callback(onRejected)
          }
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  static resolve(value) {
    return new Mypromise((resolve, reject) => {
      if(value instanceof Promise) {
        value.then(v => {
          resolve(v)
        },r => {
          reject(r)
        })
      } else {
        resolve(value)
      }
    })
  }

  static reject(reason) {
    return new Mypromise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(promise) {
    return new Mypromise((resolve, reject) => {
      let arr = []
      let count = 0
      for(let i = 0; i < promise.length; i++) {
        if(promise[i] instanceof Promise || promise[i] instanceof Mypromise) {
          promise[i].then((v) => {
            count++
            arr[i] = v
            if(count === promise.length) {
              resolve(arr)
            }
          },r => {
            reject(r)
          })
        } else {
          count++
          arr[i] = promise[i]
          if(count === promise.length) {
            resolve(arr)
          }
        }
      }
    })
  }

  static race(promise) {
    return new Promise((resolve, reject) => {
      promise.forEach(promiseItem => {
        promiseItem.then(v => {
          resolve(v)
        }, r => {
          reject(r)
        })
      })
    })
  }
}

export default Mypromise