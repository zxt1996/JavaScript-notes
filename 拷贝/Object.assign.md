# Object.assign
```
let user = {
  name: "John",
  age: 30
};

let clone = {};//新的空对象

//复制所有的属性值
for(let key in user){
    clone[key] = user[key];
}

//现在复制是独立的复制
clone.name = "Pete";//改变它的值

console.log(user.name);//原对象属性值不变

//使用Object.assign
let clones = Object.assign({},user);
```