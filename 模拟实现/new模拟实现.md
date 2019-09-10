# new的模拟实现
new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一
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