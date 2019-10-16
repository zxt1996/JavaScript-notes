# compose实现
compose函数的作用就是组合函数，将函数串联起来执行，一个函数的输出结果是另一个函数的输入参数  

```
let init = (...args) => args.reduce((ele1, ele2) => ele1 + ele2, 0)
let step2 = (val) => val + 2
let step3 = (val) => val + 3
let step4 = (val) => val + 4

steps = [step4, step3, step2, init]
let composeFunc = compose(...funcs)
```
执行
```
composeFunc(args)
```
相当于
```
fn1(fn2(fn3(fn4(args))))
```
- compose的参数是函数数组，返回的也是一个函数
- compose的参数是任意长度的，所有的参数都是函数，执行方向是自右向左的，因此初始函数一定放到参数的最右面
- compose执行后返回的函数可以接收参数，这个参数将作为初始函数的参数，所以初始函数的参数是多元的，初始函数的返回结果将作为下一个函数的参数，以此类推。因此除了初始函数以外，其他函数的接收值是一元的

## 1.面向过程实现
使用递归，不断检测队列中是否还有任务，如果有任务就执行，并把执行结果往后传递   
递归的退出条件就是最后一个函数执行完的时候，也就是count为0的时候，这时候，有一点要注意，递归退出的时候，count游标一定要回归初始状态 
```
const compose = function(...args){
    let length = args.length
    let count = length -1
    let result
    return function f1(...arg1){
        result = args[count].apply(this,arg1)
        if(count<=0){
            count = length-1
            return result
        }
        count--;
        return f1.call(null,result)
    }
}
```

## 2.函数组合实现
```
const _pipe = (f, g) => (...arg) => g.call(null, f.apply(null, arg))
const compose = (...args) => args.reverse().reduce(_pipe, args.shift())
```
reduce接收两个参数：  
- 第一个参数是在每一项上调用的函数
  - 该函数接收4个参数
    - 前一个值prev
    - 当前值cur
    - 项的索引index
    - 数组对象array
- 第二个可选参数是作为归并基础的初始值  

shift() 方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。

```
let init = (...args) => args.reduce((ele1, ele2) => ele1 + ele2, 0)
let step2 = (val) => val + 2
let step3 = (val) => val + 3
let step4 = (val) => val + 4

steps = [step4, step3, step2, init]

const _pipe = (f, g) => (...arg) => g.call(null, f.apply(null, arg))
const compose = (...args) => args.reverse().reduce(_pipe, args.shift())
let composeFunc = compose(...steps)

console.log(composeFunc(1, 2, 3))
```

## lodash版本
```
var compose = function(funcs){
    var length = funcs.length;
    var index = length;
    while(index--){
        if(typeof funcs[index]!=='function'){
            throw new TypeError('Expected a function');
        }
    }
    return function(...args){
        var index = 0;
        var result = length ? funcs.reverse()[index].apply(this,args);
        while(++index < length){
            result = funcs[index].call(this,result);
        }
        return result;
    }
}
```

## Redux版本
```
function compose(...funcs){
    if(funcs.length === 0){
        return arg => arg;
    }
    if(funcs.length === 1){
        return funcs[0];
    }

    return funcs.reduce((a,b)=>(...args)=>a(b(...args)))
}
```