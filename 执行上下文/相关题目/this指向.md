## 1.代码执行结果
```
var a = 10;
var obj = {
    a: 20,
    say: function () {
        console.log(this.a);
    }
};
obj.say();

//20
```
### 改变指向,让输出变为10
```
//方式1
var a = 10;
var obj = {
    a:20,
    say:()=>{
        console.log(this.a);
    }
};
obj.say();//10

//方式2
var a = 10;
var obj = {
    a:20,
    say:function(){
        console.log(this.a);
    }
};
obj.say.call(this);

//方式3
var a = 10;
var obj = {
    a:20,
    say:function(){
        console.log(this.a);
    }
};

var say = obj.say;
say();
```