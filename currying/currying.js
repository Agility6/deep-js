function add(x,y,z) {
  return x + y + z
}

console.log(add(1,2,3))

// 柯里化处理
function add2(x) {
  return function(y) {
    return function(z) {
      return x + y + z
    }
  }
}

console.log(add2(1)(2)(3));

// 传入的函数需要分别被进行处理
function add3(x) {
  x = x + 2
  return function(y) {
    y = y * 2
    return function(z) {
      z = z ** 2
      return x + y + z
    }
  }
}
console.log(add3(1)(2)(3))

// makeAdder函数(柯里化+闭包)
function makeAdder(num) {
  return function(count) {
    return num + count
  }
}

var add5 = makeAdder(5)
add3(10)
add3(100)

// 简化柯里化(箭头函数特性)
var sum = x => y => z => x + y + z
console.log(sum(1)(2)(3))

// 打印日志的柯里化
var log = date => type => message => {
  console.log(`[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`)
}

// 固定时间
var nowLog = log(new Date())
nowLog("DEBUG")("查找到Bug")
nowLog("DEBUG")("查找到Bug2")

// 固定时间and类型
var nowAndDebugLog = log(new Date())("DEBUG")
nowAndDebugLog("查找到Bug3")
nowAndDebugLog("查找到Bug4")
