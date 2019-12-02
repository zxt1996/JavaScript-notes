# Promise.prototype.catch()
Promise对象的错误具有“**冒泡**”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获  

```
getJSON('/post/1.json').then(function(post){
    return getJSON(post.commentURL);
}).then(function(comments){
    //some code
}).catch(function(error){
    //处理前面三个Promise产生的错误
})
```
一般来说，不要在then方法里面定义Reject状态的回调函数(即then的第二个参数)，总是使用catch方法  

```
//bad
Promise.then(function(data){
    //success
},function(err){
    //error
});

//good
promise.then(function(data){
    //success
}).catch(function(err){
    //error
});
```
第二种写法要好于第一种写法，理由是第二种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。  

跟传统的try/catch代码块不同的是，**如果没有使用catch方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码**，即不会有任何反应。

```
const someAsyncThing = function(){
    return new Promise(function(resolve,reject){
        //报错，因为x没有声明
        resolve(x+2);
    });
};

someAsyncThing().then(function(){
    console.log('everything is great');
});

setTimeout(()=>{
    console.log(123)
},2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```
someAsyncThing函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

```
const promise = new Promise(function(resolve,reject){
    resolve('ok');
    setTimeout(function(){
        throw new Error('test')
    },0);
});

promise.then(function(value){
    console.log(value)
});
// ok
// Uncaught Error: test
```
Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。