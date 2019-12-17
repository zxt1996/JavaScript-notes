# 微任务(Microtasks)
> promise的处理程序(handlers).then、.catch和.finally都是异步的。
> 即便一个promise立即被resolve,.then、.catch和.finally下面的代码也会在这些处理程序之前被执行

```
let promise = Promise.resolve();
promise.then(()=>alert("promise done"));

alert("code finished");//该警告框会首先弹出
```

## 微任务队列(Microtasks queue)
> 当一个promise准备就绪时，它的.then/catch/finally处理程序被放入队列中。但是不会立即被执行。当JS引擎执行完当前的代码，它会从队列中获取任务并执行它。

## 未处理的rejection
**“未处理的 rejection”是指在 microtask 队列结束时未处理的 promise 错误。**

```
let promise = Promise.reject(new Error("Promise Failed"));
promise.catch(err=>alert('caught'));

//不会运行：错误已被处理
window.addEventListener('unhandledrejection',event=>alert(event.reason));
```
但是如果我们忘记添加 .catch，那么微任务队列清空后，JavaScript 引擎会触发以下事件：
```
let promise = Promise.reject(new Error("Promise Failed!"));

// Promise Failed!
window.addEventListener('unhandledrejection', event => alert(event.reason));
```
如果我们迟点再处理这个错误会怎样？比如：
```
let promise = Promise.reject(new Error("Promise Failed!"));
setTimeout(() => promise.catch(err => alert('caught')));

// Error: Promise Failed!
window.addEventListener('unhandledrejection', event => alert(event.reason));
```

> 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件；这可能发生在 window 下，但也可能发生在 Worker 中。 这对于调试回退错误处理非常有用。