# async函数
## 1.async作用
async用来表示函数是异步的，定义的函数会返回一个promise对象，可以使用then方法添加回调函数。
```
async function demo01() {
    return 123;
}

demo01().then(val => {
    console.log(val);// 123
});
若 async 定义的函数有返回值，return 123;相当于Promise.resolve(123),没有声明式的 return则相当于执行了Promise.resolve();
```
## 2.await关键字
await 后面可以跟任何的JS 表达式。虽然说 await 可以等很多类型的东西，但是它最主要的意图是用来等待 Promise 对象的状态被 resolved。如果await的是 promise对象会造成异步函数停止执行并且等待 promise 的解决,如果等的是正常的表达式则立即执行。
```
function sleep(second) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(' enough sleep~');
        }, second);
    })
}
function normalFunc() {
    console.log('normalFunc');
}
async function awaitDemo() {
    await normalFunc();
    console.log('something, ~~');
    let result = await sleep(2000);
    console.log(result);// 两秒之后会被打印出来
}
awaitDemo();
// normalFunc
// VM4036:13 something, ~~
// VM4036:15  enough sleep~
```

## 3.async/await 的优势在于处理 then 链
```
//我们仍然使用 setTimeout 来模拟异步请求
function sleep(second, param) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(param);
        }, second);
    })
}

async function test() {
    let result1 = await sleep(2000, 'req01');
    let result2 = await sleep(1000, 'req02' + result1);
    let result3 = await sleep(500, 'req03' + result2);
    console.log(`
        ${result3}
        ${result2}
        ${result1}
    `);
}

test();
//req03req02req01
//req02req01
//req01
```
## 4.错误处理
```
function sleep(second) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('want to sleep~');
        }, second);
    })
}

async function errorDemo() {
    let result = await sleep(1000);
    console.log(result);
}
errorDemo();// VM706:11 Uncaught (in promise) want to sleep~

// 为了处理Promise.reject 的情况我们应该将代码块用 try catch 包裹一下
async function errorDemoSuper() {
    try {
        let result = await sleep(1000);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

errorDemoSuper();// want to sleep~
// 有了 try catch 之后我们就能够拿到 Promise.reject 回来的数据了。
```
## 5.并行处理
```
function sleep(second) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('request done! ' + Math.random());
        }, second);
    })
}

async function correctDemo() {
    let p1 = sleep(1000);
    let p2 = sleep(1000);
    let p3 = sleep(1000);
    await Promise.all([p1, p2, p3]);
    console.log('clear the loading~');
}
correctDemo();// clear the loading~
```
## 6.await in for 循环
await必须在async函数的上下文中的。
```
// 正常 for 循环
async function forDemo() {
    let arr = [1, 2, 3, 4, 5];
    for (let i = 0; i < arr.length; i ++) {
        await arr[i];
    }
}
forDemo();//正常输出
// 因为想要炫技把 for循环写成下面这样
async function forBugDemo() {
    let arr = [1, 2, 3, 4, 5];
    arr.forEach(item => {
        await item;
    });
}
forBugDemo();// Uncaught SyntaxError: Unexpected identifier
```