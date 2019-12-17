# Promise.allSettled
Promise.allSettled 等待所有的 promise 都被处理：即使其中一个 reject，它仍然会等待其他的 promise。处理完成后的数组有：  

- {status:"fulfilled", value:result} 对于成功的响应，
- {status:"rejected", reason:error} 对于错误的响应。

#### 我们想要获取多个用户的信息。即使其中一个请求失败，我们仍然对其他的感兴趣。
```
let urls = [
    'https://api.github.com/users/iliakan',
    'https://api.github.com/users/remy',
    'https://no-such-url'
  ];

Promise.allSettled(urls.map(url=>fetch(url)))
  .then(results => {
      results.forEach((result,num)=>{
          if(result.status == 'fulfilled'){
              alert(`${urls[num]}:${result.value.status}`);
          }
          if(result.status == 'rejected'){
              alert(`${urls[num]}:${result.reason}`);
          }
      });
  });

//   [
//     {status: 'fulfilled', value: ...response...},
//     {status: 'fulfilled', value: ...response...},
//     {status: 'rejected', reason: ...error object...}
//   ]
```

### Polyfill
如果浏览器不支持 Promise.allSettled，使用 polyfill 很容易让其支持：
```
if(!Promise.allSettled){
    Promise.allSettled = function(promises){
        return Promise.all(promises.map(
            p => Promise.resolve(p).then(
                v => ({
                    state:'fulfilled',
                    value:v,
                }),
                r => ({
                    state:'rejected',
                    reason:r,
                })
            )
        ))
    }
}
```
在这段代码中，promises.map 获取输入值，并使用 p => Promise.resolve(p) 将该值转换为 promise（以防传递了非 promise），然后向其添加 .then 处理器。

这个处理器将成功的结果 v 转换为 {state:'fulfilled', value:v}，将错误的结果 r 转换为 {state:'rejected', reason:r}。这正是 Promise.allSettled 的格式。

然后我们就可以使用 Promise.allSettled 来获取结果或所有给出的 promise，即使其中一些被 reject。