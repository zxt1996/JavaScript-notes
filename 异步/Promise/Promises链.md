# Promises链
```
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

## 返回promises
如果返回的值是一个 promise，那么直到它结束之前，下一步执行会一直被暂停。在结束之后，该 promise 的结果会传递给下一个 .then 处理程序。

```
new Promise(function(resolve,reject){
    setTimeout(()=>resolve(1),1000);
}).then(function(result){
    alert(result);//1
    return new Promise((resolve,reject)=>{
        setTimeout(()=>resolve(result*2),1000);
    });
}).then(function(result){
    alert(result);//2

    return new Promise((resolve,reject)=>{
        setTimeout(()=>resolve(result*2),1000);
    });
}).then(function(result){
    alert(result);//4
});
```