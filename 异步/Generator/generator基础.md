# Generator
Generator函数是一个状态机，封装了多个内部状态。  

会返回一个遍历器对象，可以依次遍历Generator函数内部的每一个状态。  

```
function* helloWorldGenerator(){
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();

hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }
```
遍历器对象的next方法的运行逻辑：  
1. 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。  
2. 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式  
3. 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
4. 如果该函数没有return语句，则返回的对象的value属性值为undefined。  

**yield表达式只能用在Generator函数里面，用在其他地方都会报错**

```
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  a.forEach(function (item) {
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  });
};

for (var f of flat(arr)){
  console.log(f);
}
```
上面代码也会产生句法错误，因为forEach方法的参数是一个普通函数，但是在里面使用了yield表达式  

## next方法的参数
**yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值**  

```
function* foo(x){
    var y = 2*(yield(x+1));
    var z = yield(y/3);
    return (x+y+z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```
上面代码中，第二次运行next方法的时候不带参数，导致 y 的值等于2 * undefined（即NaN），除以 3 以后还是NaN，因此返回对象的value属性也等于NaN。第三次运行Next方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。

如果向next方法提供参数，返回结果就完全不一样了。上面代码第一次调用b的next方法时，返回x+1的值6；第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8；第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。

注意，由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。V8 引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。

## for...of循环
```
function* foo(){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for(let v of foo()){
    console.log(v);
}
// 1 2 3 4 5
```
一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象   

除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。  

```
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## yield* 表达式
用来在一个 Generator 函数里面执行另一个 Generator 函数。  

```
let delegatedIterator = (function* (){
    yield 'Hello!';
    yield 'Bye!';
}());

let delegatingIterator = (function* (){
    yield 'Greetings！';
    yield* delegatedIterator;
    yield 'Ok,bye';
}());

for(let value of delegatingIterator){
    console.log(value);
}

// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye."
```
yield*后面的Generator函数(没有return语句时),等同于在Generator函数内部，部署一个for...of循环  

```
function* concat(iter1,iter2){
    yield* iter1;
    yield* iter2;
}

//等同于
function* concat(iter1,iter2){
    for(var value of iter1){
        yield value;
    }
    for(var value of iter2){
        yield value;
    }
}
```