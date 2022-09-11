/**
 * WeakSet与Set的区别
 *  - 只能存放对象
 *  - 对对象是弱引用
 */

/**
 * WeakSet的应用场景
 */
const personSet = new WeakSet()
class Person {
  constructor() {
    personSet.add(this)
  }

  running() {
    if(!personSet.has(this)) {
      throw new Error("No~")
    }
    console.log("running", this)
  }
}
const p = new Person()
p.running() // running Person {}

const p2 = new Person()
p2.running.call({name: "Ag"}) // No~