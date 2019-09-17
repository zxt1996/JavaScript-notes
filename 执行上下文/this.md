- 解析器在调用函数每次都会向函数内部传递进一个隐含的参数
- 这个隐含的参数就是this，this指向的是一个对象，
- 这个对象我们称为函数执行的上下文对象，
- 根据函数的调用方式的不同，this会指向不同的对象

**this是执行上下文环境的一个属性，而不是某个变量对象的属性**  
因为和变量不同，this是没有一个类似搜索变量的过程。当你在代码中使用this，这个this的值就直接从执行的上下文中获取了，而不会从作用域链中搜寻。  
**this的值只取决于进入上下文时的情况**  

## this的情况：
1. 以函数形式调用时，this永远都是window
```
window.auntie = '漂亮阿姨';
function callAuntie () {
  console.log('call:', this.auntie);
  // function 內的 function
  function callAgainAuntie () {
    console.log('call again:', this.auntie);
  }
  callAgainAuntie();
}
callAuntie();
//无论在哪一层，纯粹的调用方式 this 都会指向 window。
```
2. 以方法的形式调用时，this是调用方法的对象
```
function callName() {
  console.log(this.name);
}
var name = '全域阿婆';
var auntie = {
  name: '漂亮阿姨',
  callName: callName  
  // 這裡的 function 指向全域的 function，但不重要
}
callName()        // '全域阿婆'
auntie.callName() // '漂亮阿姨'，以方法的形式调用时，this是调用方法的对象
```
3. 以构造函数的形式调用时，this是新创建的那个对象  
```
class Car {
  setName(name) {
    this.name = name
  }
  
  getName() {
    return this.name
  }
}
  
const myCar = new Car()
myCar.setName('hello')
console.log(myCar.getName()) // hello
```
4. 使用call和apply调用时，this是指定的那个对象  
call()和apply()
- 这两个方法都是函数对象的方法，需要通过函数对象来调用
- 当对函数调用call()和apply()都会调用函数执行
- 在调用call()和apply()可以将一个对象指定为第一个参数,此时这个对象将会成为函数执行时的this
- call()方法可以将实参在对象之后依次传递
- apply()方法需要将实参封装到一个数组中统一传递
```
var name = '全域阿婆';
function callName() {
  console.log(this.name);
}
callName();                        // '全域阿婆'
callName.call({name: '漂亮阿姨'});  // '漂亮阿姨'
```
5. 箭头函数没有单独的this值，导致内部的this就是外层代码块的this
```
const obj = {
  x: 1,
  hello: function(){
    // 這邊印出來的 this 是什麼，test 的 this 就是什麼
    // 就是我說的：
    // 在宣告它的地方的 this 是什麼，test 的 this 就是什麼
    console.log(this)     
    const test = () => {
      console.log(this.x)
    }
    test()
  }
}
  
obj.hello() // 1
const hello = obj.hello
hello() // undefined
```