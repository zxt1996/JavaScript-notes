# call模拟实现
```
var foo = {
    value:1
};

function bar(){
    console.log(this.value);
}

bar.call(foo);  //1
```
- call改变了this的指向，指向到foo
- bar函数执行

## 模拟实现
```
Function.prototype.call2 = function (context){
    //当参数为null时视为指向window
    var context = context || window;
    context.fn = this;

    //解决不定长的参数问题
    var args = [];
    for(var i = 1,len=arguments.length;i<len;i++){
        args.push('arguments['+ i +']');
    }

    //eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
    //要把这个参数数组放到要执行的函数的参数里面去
    var result = eval('context.fn('+ args +')');

    delete context.fn
    return result;
}

//测试
var value = 2;

var obj = {
    value:1
}

function bar(name,age){
    console.log(this.value);
    return {
        value:this.value,
        name:name,
        age:age
    }
}

bar.call2(null);//2

console.log(bar.call2(obj,'kevin',18));

//1
//Object{
    value:1,
    name:'kevin',
    age:18
}
```

## apply的模拟实现
```
Function.prototype.apply = function(context,arr){
    var context = Object(context)||window;
    context.fn = this;

    var result;
    if (!arr){
        result = context.fn();
    }else{
        var args = [];
        for(var i = 0,len=arr.length;i<len;i++){
            args.push('arr['+ i +']');
        }
        result = eval('context.fn('+ args +')')
    }

    delete context.fn
    return result;
}
```