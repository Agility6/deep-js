/**
 * pure-function
 * slice contrast splice
 */
var names = ['a','b','c','d']
var result = names.slice(0,3)

// ['a','b','c']
console.log(result)
// ['a','b','c','d']
console.log(names)

var names2 = ['a','b','c','d']
var result2 = names2.splice(0,3)

// [ 'a', 'b', 'c' ]
console.log(result2)
// [ 'd' ]
console.log(names2)

/**
 * example
 */

// foo纯函数
function foo(num1, num2) {
  return num1 * 2 + num2 * num2
}
foo(1,2)

// bar不是函数
var myName = "agility"
function bar() {
  console.log("bar函数")
  myName = "Agility"
}
bar()
console.log(myName)

// test不是纯函数(修改了传入的参数)
function test(info) {
  info.age = 18
}
var obj = {age: '20', myName: 'agility'}
test(obj)
console.log(obj)

// 是纯函数(符合纯函数的定义)
var obj2 = {age:'20', myName: 'agility'}
function test2(info) {
  return {
    ...info,
    age: 18
  }
}
console.log(test2(obj2))
console.log(obj2)
