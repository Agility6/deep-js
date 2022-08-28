// 测试函数
function add(x,y,z) {
  return x + y + z
}

function foo(x,y,z) {
  console.log(this)
}

/**
 * 自动柯里化
 * @param {*} fn 函数
 * 1. 返回函数
 * 2. 参数的可能性，(x)(y)(z)/(x,y)(z)/(x,y,z)等
 * 3. 当参数符合，则直接使用apply调用函数(以防this指向例子中呈现)
 * 4. 不符合参数个数，递归知道符合条件
 */
function myCurrying(fn) {
  // 1.返回函数
  function curried(...args) {
    // 2.判断参数是否是否条件
    if(args.length >= fn.length) {
      // 2.1 参数符合条件，直接调用函数
      // 2.2 注意使用apply/call调用，以防使用時修改了this
      return fn.apply(this,args)
    } else {
      return function(...args2) {
        // 不符合，继续传入参数，并且将上一次传入的参数与其合并
        return curried.apply(this, args.concat(args2))
      }
    }
  }
  return curried
}

var curryAdd = myCurrying(add)
console.log(curryAdd(10,20,30))
console.log(curryAdd(10,20)(30))
console.log(curryAdd(10)(20)(30))

// 改变this指向
var curryFoo = myCurrying(foo)
curryFoo.call("我改变了this",1,2,3)
