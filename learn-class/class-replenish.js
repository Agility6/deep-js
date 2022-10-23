/**
 * 抽象基类
 */

// 1.实现可以被其他类继承，但是本身不能实例化
class Vehicle {
  constructor() {
    console.log(new.target)
    if(new.target === Vehicle) {
      throw new Error('Vehicle cannot be directly instantiated')
    }
  }
}
class Bus extends Vehicle {}
new Bus()
// 本事实例化不了
new Vehicle()

// 2.要求派生类必须有定义某个方法
class Vehicle2 {
  constructor() {
    if(new.target === Vehicle2) {
      throw new Error('Vehicle2 cannot be directly instantiated')
    }
    console.log(this);
    if(!this.foo2) {
      throw new Error('Inheriting class must define foo2()')
    }
    console.log('success!')
  }
}
class Bus2 extends Vehicle2 {
  foo2() {}
}
var b = new Bus2()
console.log(Object.getOwnPropertyDescriptors(Bus.prototype))
b.bar()
console.log(b);
console.log(Vehicle);


/**
 * 非函数原型和类成员
 */
class Person {
  sayName() {
    console.log(`${Person.greeting} ${this.name}`)
  }
}
// 在类上定义数据成员
Person.greeting = 'My name is'
// 在原型上定义数据成员
Person.prototype.name = 'Jake'
// 在原型上定义数据成员
let p = new Person()
console.log(Object.getOwnPropertyDescriptors(Person));
p.sayName()

let p2 = new Person()
p2.sayName()