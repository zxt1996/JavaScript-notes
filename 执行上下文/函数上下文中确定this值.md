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
