# new的模拟实现
new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一  
使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。  
1. 创建(或者说构建)一个全新的对象
2. 这个新对象会被执行[[Prototype]]连接
3. 这个新对象会被绑定到函数调用的this
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。
```
function Otaku(name,age){
    this.name = name;
    this.age = age;

    this.habit = 'Games';
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function (){
    console.log('I am'+this.name);
}

var person = new Otaku('kevin','18');

console.log(person.name)//kevin
console.log(person.habit)//Games
console.log(person.strength)//60

person.sayYourName();//I am kevin
```

## 返回值效果
- 返回值是一个对象
- 返回值是一个基本类型的值

```
function Otaku(name,age){
    this.strength = 60;
    this.age = age;

    return {
        name:name,
        habit:'Games'
    }
}

var person = new Otaku('Kevin','18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined
```

```
function Otaku (name, age) {
    this.strength = 60;
    this.age = age;

    return 'handsome boy';
}

var person = new Otaku('Kevin', '18');

console.log(person.name) // undefined
console.log(person.habit) // undefined
console.log(person.strength) // 60
console.log(person.age) // 18
```
## 模拟实现
```
function objectFactory(){
    var obj = new Object();

    //shift() 方法从数组中删除第一个元素，并返回该元素的值。
    //取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
    Constructor = [].shift.call(arguments);
 
    //将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    obj.__proto__ = Constructor.prototype;

    //使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
    var ret = Constructor.apply(obj,arguments);

    //判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么。
    return typeof ret === 'object' ? ret : obj;
}
```