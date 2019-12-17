# Promisification
**将一个接收回调的函数转转为一个返回promise的函数**

```
function loadScript(src,callback){
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => callback(null,script);
    script.onerror = () => callback(new Error(`Script load error for ${src}`));

    document.head.append(script);
}

//用法
loadScript('path/script.js',(err,script)=>{//...})
```

使用promisify

```
let loadScriptPromise = function(src){
    return new Promise((resolve,reject)=>{
        loadScript(src,(err,script)=>{
            if(err){
                reject(err);
            }else{
                resolve(script);
            }
        });
    })
}

//用法
loadScriptPromise('path/script.js').then(//..)
```

#### 返回 promise 并且把调用传递给原来的 f，在自定义的回调函数中跟踪结果：
```
function promisify(f){
    return function (...args){
        return new Promise((resolve,reject)=>{
            function callback(err,result){
                if(err){
                    return reject(err);
                }else{
                    resolve(result);
                }
            }
            //在参数的最后附上我们自定义的回调函数
            args.push(callback);
            //调用原来的函数
            f.call(this,...args);
        })
    }
}

//用法
let loadScriptPromise = promisify(loadScript);
loadScriptPromise(...).then(...);
```

promisify版本

```
//设定为promisify(f,true)来获取结果数组
function promisify(f,manyArgs=false){
    return function(...args){
        return new Promise((resolve,reject)=>{
            function callback(err,...results){
                if(err){
                    return reject(err);
                }else{
                    //如果manyArgs被指定值，则resolve所有回调结果
                    resolve(manyArgs ? results : results[0]);
                }
            }

            args.push(callback);

            f.call(this,...args);
        })
    }
}

//用法
f = promisify(f,true);
f(...).then(arrayOfResults => ...,err => ...)
```