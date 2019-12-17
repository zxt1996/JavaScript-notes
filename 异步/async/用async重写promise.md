# 用async/await来重写
```
function loadJson(url){
    return fetch(url).then(
        response => {
            if(response.status == 200){
                return response.json();
            }else{
                throw new Error(response.status);
            }
        }
    )
}

loadJson('no-such-user.json').catch(alert);//Error:404
```

```
async function loadJson(url){
    let response = await fetch(url);

    if(response.status == 200){
        let json = await response.json();
        return json;
    }

    throw new Error(response.status);
}

loadJson('no-such-user.json').catch(alert);
```

## 用async/await来重写rethrow
```
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
    })
}

// 查询用户名直到 github 返回一个合法的用户
function demoGithubUser() {
  let name = prompt("Enter a name?", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then(user => {
      alert(`Full name: ${user.name}.`);
      return user;
    })
    .catch(err => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("No such user, please reenter.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

demoGithubUser();
```

```
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}

// 查询用户名直到 github 返回一个合法的用户
async function demoGithubUser() {

  let user;
  while(true) {
    let name = prompt("Enter a name?", "iliakan");

    try {
      user = await loadJson(`https://api.github.com/users/${name}`);
      break; // 没有错误，退出循环
    } catch(err) {
      if (err instanceof HttpError && err.response.status == 404) {
        // 循环将在警告后继续
        alert("No such user, please reenter.");
      } else {
        // 未知错误，rethrow
        throw err;
      }
    }
  }


  alert(`Full name: ${user.name}.`);
  return user;
}

demoGithubUser();
```