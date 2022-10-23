/**
 * 静态方法
 */
class Person {
  constructor() {
    this.locate = () => console.log('instance', this)
  }
  locate() {
    console.log('prototype', this)
  }
  static locate() {
    console.log('class', this)
  }
}
let p = new Person()
p.locate() // instance Person { locate: [Function (anonymous)] }
Person.prototype.locate() // prototype {}
Person.locate() // class [class Person]

// 静态类方法非常适合作为实例工厂
class Person2 {
  constructor(age) {
    this._age = age
  }
  sayAge() {
    console.log(this._age)
  }
  static create() {
    return new Person2(Math.floor(Math.random()*100))
  }
}

console.log(Person2.create())
console.log(Person2.create())
console.log(Person2.create())