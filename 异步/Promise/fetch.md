# fetch
```
let promise = fetch(url);
```
它发送网络请求到 url 并**返回一个 promise**。当远程服务器返回响应头（注意不是全部响应加载完成）时，该 promise 用一个 response 来 resolve 掉。

为了读取全部的响应，我们应该调用方法 **response.text()**：当全部文字内容从远程服务器上下载后，它会返回一个 resolved 状态的 promise，同时该文字会作为 result。  

```
fetch('/article/promise-chaining/user.json')
//当远程服务器开始响应时，下面的.then执行
.then(function(response){
    //当结束下载时，response.text()会返回一个新的resolved promise，该promise拥有全部响应文字
    return response.text();
}).then(function(text){
    //...这是远程文件内容
    alert(text);//{"name": "iliakan", isAdmin: true}
})
```

```
// 同上，但是使用 response.json() 把远程内容解析为 JSON
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan
```

#### 多发一个请求到 GitHub，加载用户信息并显示头像

```
//发一个user.json请求
fetch('/article/promise-chaining/user.json')
//作为json加载
.then(response=>response.json())
//发一个请求到GitHub
.then(user=>fetch(`https://api.github.com/users/${user.name}`))
//响应作为json加载
.then(response=>response.json())
// 显示头像图片（githubUser.avatar_url）3 秒（也可以加上动画效果）
.then(githubUser=>{
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(()=>img.remove(),3000);
});
```
为了使链可扩展，我们需要在头像结束显示时返回一个 resolved 状态的 promise。  

```
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise(function(resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  }))
  // triggers after 3 seconds
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
```
现在，在 setTimeout 后运行 img.remove()，然后调用 resolve(githubUser)，这样链中的控制流程走到下一个 .then 并传入用户数据。  

作为一个规律，一个异步动作应该永远返回一个 promise。

这让它规划下一步动作成为可能。虽然现在我们没打算扩展链，我们可能在日后需要它。  

```
function loadJson(url){
    return fetch(url).then(response=>response.json());
}

function loadGithubUser(name){
    return fetch(`https://api.github.com/users/${name}`)
            .then(response=>response.json());
}

function showAvatar(githubUser){
    return new Promise(function(resolve,reject){
        let img = document.createElement('img');
        img.src = githubUser.avatar_url;
        img.className = "promise-avatar-example";
        document.body.append(img);

        setTimeout(()=>{
            img.remove();
            resolve(githubUser);
        },3000);
    });
}

//使用它们
loadJson('/article/promise-chaining/user.json')
    .then(user=>loadGithubUser(user.name))
    .then(showAvatar)
    .then(githubUser=>alert(`Finished showing ${githubUser.name}`));
```

## 错误处理
检查具有 HTTP 状态的 **response.status 属性**，如果不是 200 就抛出错误。  

```
class HttpError extends Error{
    constructor(response){
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

function loadJson(url){
    return fetch(url)
            .then(response=>{
                if(response.status == 200){
                    return response.json();
                }else{
                    throw new HttpError(response);
                }
            })
}

loadJson('no-such-user.json')
.catch(alert); // HttpError: 404 for .../no-such-user.json
```
从 GitHub 加载给定名称的用户。如果没有这个用户，它将告知用户填写正确的名称：  

```
function demoGithubUser(){
    let name = prompt("Enter a name?", "iliakan");

    return loadJson(`https://api.github.com/users/${name}`)
            .then(user=>{
                alert(`Full name:${user.name}`);
                return user;
            })
            .catch(err => {
                if(err instanceof HttpError && err.response.status == 404){
                    alert("No such user,please reenter.");
                    return demoGithubUser();
                }else{
                    throw err;
                }
            });
}

demoGithubUser();
```