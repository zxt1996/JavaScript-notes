# reduce实现
reduce接收两个参数：  
- 第一个参数是在每一项上调用的函数
  - 该函数接收4个参数
    - 前一个值prev
    - 当前值cur
    - 项的索引index
    - 数组对象array
- 第二个可选参数是作为归并基础的初始值  

reduce方法返回一个最终的值
```
arr.reduce(function(prev, cur, index, arr){}, initialValue)
```

原理实现
```
Array.prototype.reduce = function (reducer,initVal){
    for(let i=0;i<this.length;i++){
        initVal = reducer(initVal,this[i],i,this);
    }
    return initVal;
}
```
```
Array.prototype.reduce = Array.prototype.reduce || function (func,initialValue){
    var arr = this
    var base = typeof initialValue === 'undefined' ? arr[0] : initialValue
    var startPoint = typeof initialValue === 'undefined' ? 1 : 0
    arr.slice(startPoint).forEach(function(val,index){
        base = func(base,val,index+startPoint,arr)
    })
    return base
}
```
slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。