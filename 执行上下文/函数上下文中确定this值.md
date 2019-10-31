# 函数上下文中确定this值
一个函数上下文中确定this值的通用规则如下：   
在一个函数上下文中，**this由调用者提供，由调用函数的方式来决定**。如果调用括号()的左边是引用类型的值，this将设为引用类型值的base对象(base object),在其他情况下(与引用类型不同的任何其他属性)，这个值为**全局对象**  

```
function foo(){
    return this;
}

foo();//global
```

```
var foo = {
    bar:function(){
        return this;
    }
};

foo.bar();//foo
```
```
var test = foo.bar;
test();//global
```
## 为什么用表达式的不同形式激活同一个函数会有不同的this值
原因在于引用类型(type Reference)不同的中间值

### 在函数执行过程中，this一旦被确定，就不可更改
```
var a = 10;
var obj = {
    a:20
}

function fn(){
    this = obj;//这句话试图修改this,运行后会报错
    console.log(this.a);
}

fn();
```

### 例子
```
var a = 20;
var obj = {
    a:10,
    c:this.a+20,
    fn:function(){
        return this.a;
    }
}

console.log(obj.c);
console.log(obj.fn());

//40
//10
```
单独的{}是不会形成新的作用域的，因此这里的this.a，由于并没有作用域的限制，所以它仍然处于全局作用域之中。所以这里的this其实是指向的window对象。  

```
function foo() {
    console.log(this.a)
}

function active(fn) {
    fn(); // 真实调用者，为独立调用
}

var a = 20;
var obj = {
    a: 10,
    getA: foo
}

active(obj.getA);
```

### 匿名函数的存在导致this指向的丢失
```
var obj = {
    a:20,
    getA:function(){
        setTimeout(function(){
            console.log(this.a);
        },1000)
    }
}

obj.getA();
```
在这个匿名函数中的this指向了全局  

解决方法：  

1. 使用一个变量，将this的引用保存起来  

```
var obj = {
    a:20,
    getA:function(){
        var self = this;
        setTimeout(function(){
            console.log(self.a);
        },1000)
    }
}
```
2. 借助闭包与apply方法，封住一个bind方法  

```
function bind(fn,obj){
    return function(){
        return fn.apply(obj,arguments);
    }
}

var obj = {
    a:20,
    getA:function(){
        setTimeout(bind(function(){
            console.log(this.a);
        },this),1000)
    }
}

obj.getA();
```
3. 使用自带的bind  

```
var obj = {
    a:20,
    getA:function(){
        setTimeout(function(){
            console.log(this.a);
        }.bind(this),1000)
    }
}
```