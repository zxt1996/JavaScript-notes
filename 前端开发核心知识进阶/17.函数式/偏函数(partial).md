# 偏函数(partial)
> 偏函数就是固定一个函数的一个或者多个参数，即将一个 n 元函数转换成一个 （n ﹣ k） 元函数

```
const partial = (fn,...rest)=>(...args)=>fn(...rest,...args);
```
bind 版本实现：

```
const partial = (fn,...args) => fn.bind(null,...args);
```

## 函子(functor)
### 链式调用
```
const addHelloPrefix = str => `Hello : ${str}`
const addByeSuffix = str => `${str}, bye!`
addByeSuffix(addHelloPrefix('lucas'))

//"Hello : lucas, bye!"
```
使用链式调用的方式
```
class Person{
    constructor(value){
        this.value = value;
    }

    addHelloPrefix(){
        return new Person(`Hello:${this.value}`);
    }

    addByeSuffix(){
        return new Person(`${this.value},bye`);
    }
}

new Person('lucas').addHelloPrefix().addByeSuffix();

//{value: "Hello : lucas, bye"}
```

通用化
```
class Functor{
    constructor(value){
        this.value = value;
    }

    static of(value){
        return new Functor(value);
    }
    apply(fn){
        return Functor.of(fn(this.value));
    }
}

Functor.of('lucas').apply(addHelloPrefix).apply(addByeSuffix)

//{value: "Hello : lucas, bye!"}
```
> Functor 的 constructor 按照惯例接收数据；同时定义 Functor 一个静态方法 of，这个方法专门用来返回一个 Functor 实例对象；apply 方法接受一个 fn，使用 fn 对当前实例的 value 进行计算，得到新的 value 之后交给静态 of 方法，最终得到还有新 value 的实例。

### Maybe函子
```
class Maybe{
    constructor(value){
        this.value = value;
    }

    static of(value){
        return new Maybe(value);
    }

    apply(fn){
        return this.value ? Maybe.of(fn(this.value)) : new Maybe(null);
    }
}
```

> 不同类型的函子，可以完成不同的功能。他们的共同点是：每个函子并没有直接去操作需要处理的数据（我们没有看到的 this.value 的直接写操作）而是通过 apply 接口应用 fn，并最终返回一个新的函子。