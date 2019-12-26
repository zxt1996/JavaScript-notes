# 数组map方法
```
let arr = [2, 56, 78, 34, 65];
let new_arr = arr.map(function(num){
    return num/2;
});

console.log(new_arr);
```

## 实现
```
Array.prototype.map = function(callbackFn,thisArg){
    //处理数组类型异常
    if(this === null || this === undefined){
        throw new TypeError("Cannot read property 'map' of null or undefined");
    }

    //处理回调类似异常
    if(Object.prototype.toString.call(callbackFn) != "[object Function]"){
        throw new TypeError(callbackFn + ' is not a function');
    }

    //草案中提到要先转换为对象
    let O = Object(this);
    let T = thisArg;

    let len = O.length >>> 0;
    let A = new Array(len);
    for(let k=0;k<len;k++){
        //利用in在原型链中查找
        //用hasOwnProperty只能找私有属性
        if(k in O){
            let kValue = O[k];
            //依次传入this,当前项，当前索引，整个数组
            let mappedValue = callbackFn.call(T,kValue,k,o);
            A[k] = mappedValue;
        }
    }

    return A;
}
```
 length >>> 0, 字面意思是指"右移 0 位"，但实际上是把前面的空位用0填充，这里的作用是保证len为数字且为整数。