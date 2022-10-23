/**
 * 类定义也支持获取和设置访问器
 */
class Person {
  constructor(name) {
    this.name_ = name
  }
  set name(newName) {
    this.name_ = newName
  }
  get name() {
    return this.name_
  }
}
let p = new Person('Agility')
p.name = 'Jake'
console.log(p.name)