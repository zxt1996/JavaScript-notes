# Promise
## 1.含义
Promise 对象用于一个异步操作的最终完成（或失败）及其结果值的表示。简单点说，它就是用于处理异步操作的，异步处理成功了就执行成功的操作，异步处理失败了就捕获错误或者停止后续操作。
```
new Promise(
    /* executor */
    function(resolve, reject) {
        if (/* success */) {
            // ...执行代码
            resolve();
        } else { /* fail */
            // ...执行代码
            reject();
        }
    }
);
```
其中，Promise中的参数executor是一个执行器函数，它有两个参数resolve和reject。它内部通常有一些异步操作，如果异步操作成功，则可以调用resolve()来将该实例的状态置为fulfilled，即已完成的，如果一旦失败，可以调用reject()来将该实例的状态置为rejected，即失败的。
## 2.方法
### 2.1Promise.prototype.then()
作用是为 Promise 实例添加状态改变时的回调函数。  
then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。  
then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
```
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function funcA(comments) {
  console.log("resolved: ", comments);
}, function funcB(err){
  console.log("rejected: ", err);
});
```
上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用funcA，如果状态变为rejected，就调用funcB。
```
var promise2 = new Promise(function(resolve, reject) {
  // 2秒后置为接收状态
  setTimeout(function() {
    resolve('success');
  }, 2000);
});

promise2
  .then(function(data) {
    // 上一个then()调用了resolve，置为fulfilled态
    console.log('第一个then');
    console.log(data);
    return '2';
  })
  .then(function(data) {
    // 此时这里的状态也是fulfilled, 因为上一步返回了2
    console.log('第二个then');
    console.log(data);  // 2

    return new Promise(function(resolve, reject) {
      reject('把状态置为rejected error'); // 返回一个rejected的Promise实例
    });
  }, function(err) {
    // error
  })
  .then(function(data) {
    /* 这里不运行 */
    console.log('第三个then');
    console.log(data);
    // ....
  }, function(err) {
    // error回调
    // 此时这里的状态也是fulfilled, 因为上一步使用了reject()来返回值
    console.log('出错：' + err); // 出错：把状态置为rejected error
  })
  .then(function(data) {
    // 没有明确指定返回值，默认返回fulfilled
    console.log('这里是fulfilled态');
});
```
### 2.2Promise.prototype.catch()
Promise.prototype.catch方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。
```
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
```
上面代码运行完catch方法指定的回调函数，会接着运行后面那个then方法指定的回调函数。如果没有报错，则会跳过catch方法。
### 2.3 Promise.all()
Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
```
const p = Promise.all([p1, p2, p3]);
```
p的状态由p1、p2、p3决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
```
// 置为fulfilled状态的情况
var arr = [1, 2, 3];
var promises = arr.map(function(e) {
  return new Promise(function(resolve, reject) {
    resolve(e * 5);
  });
});

Promise.all(promises).then(function(data) {
    // 有序输出
  console.log(data); // [5, 10, 15]
  console.log(arr); // [1, 2, 3]
});
```
```
// 置为rejected状态的情况
var arr = [1, 2, 3];
var promises2 = arr.map(function(e) {
  return new Promise(function(resolve, reject) {
    if (e === 3) {
      reject('rejected');
    }
    resolve(e * 5);
  });
});

Promise.all(promises2).then(function(data) {
  // 这里不会执行
  console.log(data);
  console.log(arr);
}).catch(function(err) {
  console.log(err); // rejected
});
```
### 2.4Promise.race()
Promise.race()和Promise.all()类似，都接收一个可以迭代的参数，但是不同之处是Promise.race()的状态变化不是全部受参数内的状态影响，一旦参数内有一个值的状态发生的改变，那么该Promise的状态就是改变的状态。就跟race单词的字面意思一样，谁跑的快谁赢。如下：
```
var p1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 300, 'p1 doned');
});

var p2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 50, 'p2 doned');
});

var p3 = new Promise(function(resolve, reject) {
  setTimeout(reject, 100, 'p3 rejected');
});

Promise.race([p1, p2, p3]).then(function(data) {
  // 显然p2更快，所以状态变成了fulfilled
  // 如果p3更快，那么状态就会变成rejected
  console.log(data); // p2 doned
}).catch(function(err) {
  console.log(err); // 不执行
});

```
### 2.5Promise.resolve()
Promise.resolve()接受一个参数值，可以是普通的值，具有then()方法的对象和Promise实例。正常情况下，它返回一个Promise对象，状态为fulfilled。但是，当解析时发生错误时，返回的Promise对象将会置为rejected态。如下：
```
// 参数为普通值
var p4 = Promise.resolve(5);
p4.then(function(data) {
  console.log(data); // 5
});


// 参数为含有then()方法的对象
var obj = {
  then: function() {
    console.log('obj 里面的then()方法');
  }
};

var p5 = Promise.resolve(obj);
p5.then(function(data) {
  // 这里的值时obj方法里面返回的值
  console.log(data); // obj 里面的then()方法
});


// 参数为Promise实例
var p6 = Promise.resolve(7);
var p7 = Promise.resolve(p6);

p7.then(function(data) {
  // 这里的值时Promise实例返回的值
  console.log(data); // 7
});

// 参数为Promise实例,但参数是rejected态
var p8 = Promise.reject(8);
var p9 = Promise.resolve(p8);

p9.then(function(data) {
  // 这里的值时Promise实例返回的值
  console.log('fulfilled:'+ data); // 不执行
}).catch(function(err) {
  console.log('rejected:' + err); // rejected: 8
});
```
### 2.6Promise.reject()
Promise.reject()和Promise.resolve()正好相反，它接收一个参数值reason，即发生异常的原因。此时返回的Promise对象将会置为rejected态。如下：
```
var p10 = Promise.reject('手动拒绝');
p10.then(function(data) {
  console.log(data); // 这里不会执行，因为是rejected态
}).catch(function(err) {
  console.log(err); // 手动拒绝
}).then(function(data) {
 // 不受上一级影响
  console.log('状态：fulfilled'); // 状态：fulfilled
});
```