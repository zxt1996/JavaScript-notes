# new关键字
当一个函数作为**new User(...)**执行时，它执行以下步骤：  
1. 一个新的空对象被创建并分配给this
2. 函数体执行。通常它会修改this,为其添加新的属性
3. 返回this的值  

```
function User(name){
  //this={};(隐式创建)

  //添加属性到this
  this.name = name;
  this.isAdmin = false;

  //return this;(隐式返回)
}
```

> 当我们使用new Object时，new关键字创建了一个新的对象，并将该对象作为构造函数内**this关键字指向的对象**。实际上，new关键字并未创建一个新的对象：**它只是拷贝了一个对象**这个被拷贝的对象就是**原型(prototype)**  

所有能被作为构造函数使用的函数都有一个prototype属性，这个属性对象定义了你实例化对象的结构。当使用new Object时，一个对Object.prototype的拷贝被创造出来，这个拷贝就是新创建的那个实例对象。
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

## 双语法构造函数：new.target
在一个函数内部，我们可以使用 **new.target** 属性来检查它被调用时，是否使用了 new。

常规调用为空，如果通过 new 调用，则等于函数：

```
function User(){
  alert(new.target);
}

//不带new;
User();//undefined

//带new
new User();//function User{...}
```
这可以使 new 和常规语法的工作原理相同：
```
function User(name){
  if(!new.target){
    //如果没有运行new,会为你添加new
    return new User(name);
  }
  this.name = name;
}

let john = User('John');//重新调用new User
alert(john.name);//John
```