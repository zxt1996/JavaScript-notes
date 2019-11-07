# new关键字
## 手写版本一
```
function objectFactory(){
    const obj = new Object();//从Object.prototype上克隆一个对象

    Constructor = [].shift.call(arguments);//取得外部传入的构造器

    const F = function(){};
    F.prototype = Constructor.prototype;
    obj = new F();//指向正确的原型

    Constructor.apply(obj,arguments);//借用外部传入的构造器给obj设置属性

    return obj;//返回obj
}
```
- 用new Object()的方式新建了一个对象obj
- 取出第一个参数，就是我们要传入的构造函数。因为shift会修改原数组，所以arguments会被去除第一个参数
- 将obj的原型指向构造函数，这样obj就可以访问到构造函数原型中的属性
- 使用apply，改变构造函数this的指向到新建的对象，这样obj就可以访问到构造函数中的属性
- 返回obj

测试：  
```
function Person(name,age){
  this.name = name;
  this.age = age;
  
  this.sex = 'male';
}

Person.prototype.isHandsome = true;

Person.prototype.sayName = function(){
  console.log(`Hello , my name is ${this.name}`);
}

function objectFactory() {

    let obj = new Object(),//从Object.prototype上克隆一个对象

    Constructor = [].shift.call(arguments);//取得外部传入的构造器
    
    console.log({Constructor})

    const F=function(){};
    F.prototype= Constructor.prototype;
    obj=new F();//指向正确的原型

    Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性

    return obj;//返回 obj

};

let handsomeBoy = objectFactory(Person,'Nealyang',25);

console.log(handsomeBoy.name) // Nealyang
console.log(handsomeBoy.sex) // male
console.log(handsomeBoy.isHandsome) // true

handsomeBoy.sayName(); // Hello , my name is Nealyang
```
上面没有直接修改obj的__proto__隐式挂载  
```
handsomeBoy.__proto__ === Person.prototype
//true
```

## new手写版本二
- 如果构造函数返回一个对象，那么我们也返回这个对象
- 如果否，就返回默认值  

```
function objectFactory(){
    var obj = new Object();

    Constructor = [].shift.call(arguments);

    var F = function(){};
    F.prototype = Constructor.prototype;
    obj = new F(); //指向正确的原型

    var ret = Constructor.apply(obj,arguments);//借用外部传入的构造器给obj设置属性
    
    return typeof ret === 'object' ? ret : obj;//确保构造器总是返回一个对象
}
```