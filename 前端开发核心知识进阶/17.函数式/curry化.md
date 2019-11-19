# curry化
> 在计算机科学中，柯里化（currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。  

```
const filterLowerThan10 = array => {
    let result = [];
    for(let i=0,length=array.length;i<length;i++){
        let currentValue = array[i];
        if(currentValue < 10)result.push(currentValue);
    }
    return result;
}
```
柯里化改造
```
const filterLowerNumber = number => {
    return array => {
        let result = [];
        for(let i=0,length=array.length;i<length;i++){
            let currentValue = array[i];
            if(currentValue < number)result.push(currentValue);
        }
        return result;
    }
}

const filterLowerThan10 = filterLowerNumber(10);

filterLowerThan10([1,3,5,29,34]);
```

## curry化面试题
> 实现add方法，要求：
> add(1)(2) == 3 //true
> add(1)(2)(3) == 6 //true

```
const add = arg1 => {
    const fn = arg2 => {
        return fn;
    }
    //改写内部返回的函数 toString
    fn.toString = function(){}

    return fn;
}
```

```
const add = arg1 => {
    let args = [arg1];
    const fn = arg2 => {
        args.push(arg2);
        return fn;
    }
    fn.toString = function(){
        return args.reduce((prev,item)=>prev+item,0);
    }
    return fn;
}
```
改造为
```
add(1)(2,3)(4)
```
```
const add = (...arg1) => {
    let args = [...arg1];
    const fn = (...arg2)=>{
        args = [...args,...arg2];
        return fn;
    }
    fn.toString = function(){
        return args.reduce((prev,item)=>prev+item,0);
    }
    return fn;
}
```

## 通用柯里化
- 提高复用性
- 减少重复传递不必要的参数
- 动态根据上下文创建函数

兼容 IE9 浏览器事件 API 
```
const addEvent = (function(){
    if(window.addEventListener){
        return function(type,element,handler,capture){
            element.addEventListener(type,handler,capture);
        }
    }
    else if(window.attachEvent){
        return function(type,element,fn){
            element.attachEvent('on'+type,fn);
        }
    }
})()
```
通用化的 curry 函数
```
const curry = (fn,length)=>{
    length = length || fn.length;
    return function(...args){
        if(args.length < length){
            return curry(fn.bind(this,...args),length-args.length);
        }
        else{
            return fn.call(this,...args);
        }
    }
}
```
不用bind,对每次调用时产生的参数进行存储
```
const curry = fn => {
    return tempFn = (...arg1)=>{
        if(arg1.length >= fn.length){
            return fn(...arg1);
        }
        else{
            return (...arg2)=>tempFn(...arg1,...arg2);
        }
    }
}
```
```
const curry = fn => judge = (...arg1)=>arg1.length >= fn.length ? fn(...arg1) : (...arg2)=>judge(...arg1,...arg2);
```
实现原理就是：先用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数。