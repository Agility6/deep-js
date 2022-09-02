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
        item.onRejected(value)
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
}