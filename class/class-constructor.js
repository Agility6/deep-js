/**
 * 实例化
 */
class Animal {}
class Person {
  constructor() {
    console.log('person ctor')
  }
}
class Vegetable {
  constructor() {
    this.color = 'orange'
  }
}

let a = new Animal()
let p = new Person()
console.log(p.__proto__ === Person.prototype)
console.log(Person.prototype)
let v = new Vegetable()
console.log(v.color)

/**
 * this问题
 */
class Person1 {
  constructor(override) {
    this.foo = 'foo'
    if(override) {
      return {
        bar: 'bar'
      }
    }
  }
}
let p1 = new Person1(), p2 = new Person1(true)

console.log(p1)
console.log(p1 instanceof Person1) // true
console.log(p1.__proto__) // {}

console.log(p2) // { bar: 'bar' }
console.log(p2 instanceof Person1) // false
console.log(p2.__proto__) // [Object: null prototype] {}

/**
 * 调用时new的问题
 */
function Foo() {
  console.log(this)
}
let f = Foo()
console.log(f) // window

class Bar {}
let b = Bar()
console.log(b) // 报错

class Person2 {}
let p11 = new Person2()
let p22 = new p11.constructor()

/**
 * instanceof操作符可以检测对象与类构造函数
 */
class Person3 {
  constructor() {
    console.log('111');
  }
}
let p111 = new Person3()
console.log(p111 instanceof Person3) // true
console.log(p111.constructor === Person3 ) // true
console.log(p111 instanceof Person3.constructor) // false

let p222 = new Person3.constructor()
console.log(p222 instanceof Person3) // f
console.log(p222.constructor === Person3) // f
console.log(p222 instanceof Person3.constructor) // t

/**
 * 类是JavaScript的一等公民
 */
let classlist = [
  class {
    constructor(id) {
      this.id_ = id;
      console.log(`instance ${this.id_}`)
    }
  },
  class {
    constructor(name) {
      this.name_ = name
      console.log(`instance ${this.name_}`)
    }
  }
]

function createInstance(classDefinition ,id) {
  return new classDefinition(id)
}
let foo = createInstance(classlist[0], 21)
let bar = createInstance(classlist[1], 'Agility')

/**
 * 类也可以立即实例化
 */
let foo1 = new class Foo {
  constructor(x) {
    console.log(x);
  }
}('bar')
console.log(p);
