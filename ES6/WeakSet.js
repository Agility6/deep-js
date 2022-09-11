/**
 * WeakSet与Set的区别
 *  - 只能存放对象
 *  - 对对象是弱引用
 */

/**
 * WeakSet的应用场景
 */

// 不允许类中传入this
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
// p2.running.call({name: "Ag"}) // No~


// 检测循环引用 --> mdn
function execRecursively(fn, subject, _refs = new WeakSet()) {
  // 避免递归
  if(_refs.has(subject)) {
    return
  }

  fn(subject)
  if(typeof subject === 'object') {
    _refs.add(subject)
    for(const key in subject) {
      execRecursively(fn, subject[key], _refs)
    }
  }
}

const foo = {
  foo: "Foo",
  bar: {
    bar: "Bar"
  }
}

foo.bar.baz = foo // 循环引用
execRecursively((obj) => console.log(obj), foo)