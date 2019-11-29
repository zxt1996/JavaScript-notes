# 防抖
**防抖的原理：**  
你尽管触发事件，但是我一定在事件触发n秒后才执行，如果你在一个事件触发的n秒内又触发这个事件，那我就以新的事件的时间为准，n秒后才执行，总之，就是要等你触发完事件n秒内不再触发事件，我才执行。  
1. 第一版

```
function debounce(func,wait){
    var timeout;
    return function(){
        clearTimeout(timeout)
        timeout = setTimeout(func,wait);
    }
}
```
2. 第二版  
   将this指向正确的对象

```
function debounce(func,wait){
    var tiemout;

    return function(){
        var context = this;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context)
        },wait);
    }
}
```
3. 第三版  
   event对象
```
function debounce(func,wait){
    var timeout;

    return function(){
        var context = this;
        //解决event指向问题
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context,args)
        },wait);
    }
}
```
4. 第四版  
   增加**立刻执行**的功能，通过immediate参数判断是否是立刻执行
```
function debounce(func,wait,immediate){
    var timeout;

    return function(){
        var context = this;
        var args = arguments;

        if(timeout)clearTimeout(timeout);
        if(immediate){
            //如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            },wait)
            if(callNow)func.apply(context,args)
        }
        else{
            timeout = setTimeout(function(){
                func.apply(context,args)
            },wait);
        }
    }
}
```
5. 第五版  
   只在 immediate 为 true 的时候返回函数的执行结果。
```
function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}
```
6. 第六版  
   有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行
```
// 第六版
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```
使用
```
var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    container.innerHTML = count++;
};

var setUseAction = debounce(getUserAction, 10000, true);

container.onmousemove = setUseAction;

document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancel();
})
```