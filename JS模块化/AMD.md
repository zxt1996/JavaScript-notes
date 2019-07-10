# 二、AMD
AMD规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。
- define()--定义模块
```
define(id?: String, dependencies?: String[], factory: Function|Object);
```
id 是模块的名字，它是可选的参数。  
dependencies 指定了所要依赖的模块列表，它是一个数组，也是可选的参数，每个依赖的模块的输出将作为参数一次传入 factory 中。  
factory 是最后一个参数，它包裹了模块的具体实现，它是一个函数或者对象。如果是函数，那么它的返回值就是模块的输出接口或值。
```
// 这里的 module_id（myModule）仅作为示例使用
 
define('myModule', 
    ['foo', 'bar'], 
    // 模块定义函数
    // 依赖项（foo 和 bar）被映射为函数的参数
    function ( foo, bar ) {
        // 返回一个定义了模块导出接口的值
        // （也就是我们想要导出后进行调用的功能）
    
        // 在这里创建模块
        var myModule = {
            doStuff:function(){
                console.log('Yay! Stuff');
            }
        }
 
        return myModule;
});
 
// 另一个例子可以是...
define('myModule', 
    ['math', 'graph'], 
    function ( math, graph ) {
 
        // 请注意这是一个和 AMD 有些许不同的模式，但用几种不同的方式
        // 来定义模块也是可以的，因为语法在某些方面还是比较灵活的
        return {
            plot: function(x, y){
                return graph.drawPie(math.randomGrid(x,y));
            }
        }
    };
});
```
- require()--加载模块
```
// 假设 'foo' 和 'bar' 是两个外部模块
// 在本例中，这两个模块被加载后的 'exports' 被当做两个参数传递到了回调函数中
// 所以可以像这样来访问他们
 
require(['foo', 'bar'], function ( foo, bar ) {
        // 这里写其余的代码
        foo.doSomething();
});
```
```
/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
require(["jquery","underscore"],function($,_){
  // some code here
});

```
```
// 定义math.js模块
define(function () {
    var basicNum = 0;
    var add = function (x, y) {
        return x + y;
    };
    return {
        add: add,
        basicNum :basicNum
    };
});
// 定义一个依赖underscore.js的模块
define(['underscore'],function(_){
  var classify = function(list){
    _.countBy(list,function(num){
      return num > 30 ? 'old' : 'young';
    })
  };
  return {
    classify :classify
  };
})

// 引用模块，将模块放在[]内
require(['jquery', 'math'],function($, math){
  var sum = math.add(10,20);
  $("#sum").html(sum);
});

```