# 100行代码实现Promise/A+规范
## 1.Promise状态
- pending:promise可以切换到fulfilled或rejected
- fulfilled:不能迁移到其他状态，必须有个不可变的value
- rejected:不能迁移到其他状态，必须有个不可变的reason  

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(){
    this.state = PENDING;
    this.result = null;
}

const transition = (promise,state,result)=>{
    if(promise.state !== PENDING) return;
    promise.state = state;
    promise.result = result;
}
```

## 2.Then方法
then方法接收onFulfilled和onRejected参数  

```
Promise.prototype.then = function(onFulfilled,onRejected){

}
```
onFulfilled 和 onRejected 如果是函数，必须最多执行一次。

onFulfilled 的参数是 value，onRejected 函数的参数是 reason。

then 方法可以被调用很多次，每次注册一组 onFulfilled 和 onRejected 的 callback。它们如果被调用，必须按照注册顺序调用。

```
function Promise(){
    this.state = PENDING;
    this.result = null;
    this.callbacks = [];
}
```
then方法必须返回promise
```
Promise.prototype.then = function(onFulfilled,onRejected){
    return new Promise((resolve,reject)=>{
        let callback = {onFulfilled,onRejected,resolve,reject};

        if(this.state === PENDING){
            this.callbacks.push(callback);
        }else{
            setTimeout(()=>handleCallback(callback,this.state,this.result),0)
        }
    })
}
```
在 then 方法里，return new Promise(f)，满足 then 必须 return promise 的要求。

当 state 处于 pending 状态，就储存进 callbacks 列表里。

当 state 不是 pending 状态，就扔给 handleCallback 去处理。  

then 方法返回的 promise，也有自己的 state 和 result。它们将由 onFulfilled 和 onRejected 的行为指定。

```
const handleCallback = (callback,state,result)=>{
    let {onFulfilled,onRejected,resolve,reject} = callback;
    try{
        if(state === FULFILLED){
            isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
        }else if(state === REJECTED){
            isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
        }
    }catch(error){
        reject(error);
    }
}
```
先判断 onFulfilled/onRejected 是否是函数，如果是，以它们的返回值，作为下一个 promise 的 result。

如果不是，直接以当前 promise 的 result 作为下一个 promise 的 result。

如果 onFulfilled/onRejected 执行过程中抛错，那这个错误，作为下一个 promise 的 rejected reason 来用。

then 方法核心用途是，构造下一个 promise 的 result。

## 3.The Promise Resolution Procedure
第一步，如果 result 是当前 promise 本身，就抛出 TypeError 错误。  

第二步，如果 result 是另一个 promise，那么沿用它的 state 和 result 状态。  

第三步，如果 result 是一个 thenable 对象。先取 then 函数，再 call then 函数，重新进入 The Promise Resolution Procedure 过程。  

最后，如果不是上述情况，这个 result 成为当前 promise 的 result。  

```
const resolvePromise = (promise,result,resolve,reject) => {
    if(result === promise){
        let reason = new TypeError('Can not fufill promise with itself');
        return reject(reason);
    }

    if(isPromise(result)){
        return result.then(resolve,reject);
    }

    if(isThenable(result)){
        try{
            let then = result.then;
            if(isFunction(then)){
                return new Promise(then.bind(result)).then(resolve,reject);
            }
        }catch(error){
            return reject(error);
        }
    }

    resolve(result);
}
```

## 4.整合剩余部分
1）我们有了 transition 对单个 promise 进行状态迁移。

2）我们有了 handleCallback ，在当前 promise 和下一个 promise 之间进行状态传递。

3）我们有了 resolvePromise，对特殊的 result 进行特殊处理。  

```
function Promise(f){
    this.result = null;
    this.state = PENDING;
    this.callbacks = [];

    let onFulfilled = value => transition(this,FULFILLED,value);
    let onRejected = reason => transition(this,REJECTED,reason);

    let ignore = false;
    let resolve = value => {
        if(ignore)return;
        ignore = true;
        resolvePromise(this,value,onFulfilled,onRejected);
    }
    let reject = reason => {
        if(ignore)return;
        ignore = true;
        onRejected(reason);
    }

    try{
        f(resolve,reject);
    }catch(error){
        reject(error);
    }
}
```
构造 onFulfilled 去切换到 fulfilled 状态，构造 onRejected 去切换到 rejected 状态。

构造 resolve 和 reject 函数，在 resolve 函数里，通过 resolvePromise 对 value 进行验证。

配合 ignore 这个 flag，保证 resolve/reject 只有一次调用作用。

最后将 resolve/reject 作为参数，传入 f 函数。

若 f 函数执行报错，该错误就作为 reject 的 reason 来用。

```
const handleCallbacks = (callbacks,state,result)=>{
    while (callbacks.length)handleCallback(callbacks.shift(),state,result);
}

const transition = (promise,state,result) => {
    if(promise.state !== PENDING)return;
    promise.state = state;
    promise.result = result;
    setTimeout(()=>handleCallbacks(promise.callbacks,state,result),0);
}
```
transition 函数扩充如上，当状态变更时，异步清空所有 callbacks。