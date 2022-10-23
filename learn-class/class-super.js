//  1.super只能在派生类构造函数和静态方法中使用
class Vehicle {
  constructor() {
    super()
    // SyntaxError: 'super' keyword unexpected here
  }
}

// 2.不能单独引用super关键字，要么用它调用构造函数，要么用它引用静态方法
class Vehicle2 {}
class Bus2 extends Vehicle2 {
  constructor() {
    super()
    console.log(this instanceof Vehicle2) // t
  }
}
new Bus2()

// 3.super()的行为如同调用构造函数，如果需要给父类构造函数传参，则需要手动传入
class Vehicle3 {
  constructor(licensePlate) {
    this.licensePlate = licensePlate
  }
}
class Bus3 extends Vehicle3 {
    constructor(licensePlate) {
      super(licensePlate)
    }
}
console.log(new Bus3('BBA'))

// 4.如果没有定义类构造函数，在实例化派生类時会调用super()，而且会传入所有传给派生类的参数
class Vehicle4 {
  constructor(licensePlate) {
    this.licensePlate = licensePlate
  }
}
class Bus4 extends Vehicle4 {}
console.log(new Bus4('BBA'))

// 5.在构造函数中，不能在调用super()之前引用this
class Vehicle5 {}
class Bus5 extends Vehicle5 {
  constructor() {
    console.log(this)
    // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
  }
}
new Bus5()

// 6.如果在派生类中显示定义了构造函数，则要么必须在其中调用super(),要么必须在其中返回一个对象
class Vehicle6 {}
class Car6 extends Vehicle6 {}
class Bus6 extends Vehicle6 {
  constructor() {
    super()
  }
}
class Van6 extends Vehicle6 {
  constructor() {
    return {}
  }
}
console.log(new Car6()) // Car{}
console.log(new Bus6()) // Bus{}
console.log(new Van6()) // {}