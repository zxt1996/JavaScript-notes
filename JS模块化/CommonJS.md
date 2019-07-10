# 一、CommonJS
CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。
## 1.四大环境变量
- module-代表当前模块
- exports-对外的接口
- require-用于加载模块
- global-将变量设置为可在多个文件分享
```
// 定义模块math.js
var basicNum = 0;
function add(a, b) {
  return a + b;
}
module.exports = { //在这里写上需要向外暴露的函数、变量
  add: add,
  basicNum: basicNum
}

// 引用自定义的模块时，参数包含路径，可省略.js
var math = require('./math');
math.add(2, 5);

// 引用核心模块时，不需要带路径
var http = require('http');
http.createService(...).listen(3000);

```
module.exports属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。
