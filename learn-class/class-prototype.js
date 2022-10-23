/**
 * 实例成员
 * 实例之间的成员是不共享的
 */
class Person {
  constructor() {
    this.name  = new String('Jack')
    this.sayName = () => console.log(this.name)
    this.nickNames = ['Jake', 'J-Dog']
  }
}
let p1 = new Person(),
    p2 = new Person()
p1.sayName()
p2.sayName()
console.log(p1.name === p2.name) // f
console.log(p1.sayName === p2.sayName) // f
console.log(p1.nickNames === p2.nickNames) // f


/**
 * 原型方法与访问器
 * 为了在实例间共享方法，类定于语法把在类块中定义的方法作为原型方法
 */
class Person2 {
  constructor() {
    // 添加到this的所有内容都会存在与不同的实例上
    this.locate = () => console.log('instance')
  }
  // 在类块中定义的所有内容都会定义在类的原型上
  locate() {
    console.log('prototype')
  }
}
let p3 = new Person2()
p3.locate()
Person2.prototype.locate()

const symbolKey = Symbol('symbolKey')
class person4 {
  stringKey() {
    console.log('invoked stringKey')
  }
  [symbolKey]() {
    console.log('invoked symbolKey')
  }
  ['computed' + 'Key']() {
    console.log('invoked computedKey')
  }
}
let p4 = new person4()
p4.stringKey() // invoked stringKey
p4[symbolKey]() // invoked symbolKey
p4.computedKey() // invoked computedKey