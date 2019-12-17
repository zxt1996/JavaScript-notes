# Promise.all
**并行执行**多个 promise，并等待所有 promise 准备就绪。

```
Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
    new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
    new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
]).then(alert);// 1,2,3 当 promise 就绪：每一个 promise 即成为数组中的一员
```
请注意，它们的相对顺序是相同的。即使第一个 promise 需要很长的时间来 resolve，但它仍然是结果数组中的第一个。

常见技巧是将一组作业数据映射到一个 promise 数组，然后再将它们封装进 Promise.all。  

#### 假设我们有一个存储 URL 的数组，我们就可以像这样来获取它们：
```
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

// 将每个 url 映射到 fetch 的 promise 中
let requests = urls.map(url => fetch(url));

//Promise.all等待所有都被resolve
Promise.all(requests).then(responses => responses.forEach(
    response=>alert(`${response.url}:${response.status}`)
));
```

#### 通过用户名来为一组 GitHub 用户获取他们的信息（或者我们可以通过他们的 id 来获取一系列商品，逻辑都是一样的）：
```
let names = ['iliakan', 'remy', 'jeresig'];

let requests = names.map(name => fetch(`https://api.github.com/users/${name}`));

Promise.all(requests).then(responses=>{
    //所有响应都就绪时，我们可以显示HTTP状态码
    for(let response of responses){
        alert(`${response.url}:${response.status}`);//每个url都显示200
    }

    return responses;
})
//映射response数组到response.json()中读取它们的内容
.then(responses => Promise.all(responses.map(r => r.json())))
//所有JSON结果都被解析：‘users’是它们的数组
.then(users => users.forEach(user => alert(user.name)));
```