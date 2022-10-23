/**
 * 继承的基本使用
 */
class Vehicle {}

class Bus extends Vehicle {}

let b = new Bus()
console.log(b instanceof Bus) // t
console.log(b instanceof Vehicle) // t

/**
 * 继承普通构造函数
 */
function Person() {}
class Engineer extends Person {}
let e = new Engineer()
console.log(e instanceof Engineer) // t
console.log(e instanceof Person) // t

/**
 * this的值会反映调用相应方法的实例或者类
 */
class Vehicle2 {
  identifyPrototype(id) {
    console.log(id, this)
  }
  static identifyClass(id) {
    console.log(id, this)
  }
}
class Bus2 extends Vehicle2 {}
let v2 = new Vehicle2()
let b2 = new Bus2()
b2.identifyPrototype('bus2')
v2.identifyPrototype('vehicle2')
Bus2.identifyClass('bus2')
Vehicle2.identifyClass('vehicle2')