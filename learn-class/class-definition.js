// 类声明
class Person {}

// 类表达式
var Animal = class {}

console.log(foo) // undefined
var foo = function() {}
console.log(bar) // undefined
var bar = class {}

console.log(foo1) // [Function: foo1]
function foo1() {}
console.log(bar1) // Identifier 'bar' has already been declared
class bar1 {}

/**
 * 作用域与函数的区别
 */
{
  function foo2() {}
  class bar2 {}
}
console.log(foo2) // [Function: foo]
console.log(bar2) // error

/**
 * 类表达式的名称
 * 可以通过name获取名称
 */
let Person1 = class PersonName {
  identify() {
    console.log(Person1.name , PersonName.name)
  }
}
let p = new Person1() 
p.identify() // PersonName PersonName
console.log(Person1.name)
console.log(PersonName) // PersonName is not undefined
