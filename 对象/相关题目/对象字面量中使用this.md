# 对象字面量中使用"this"
```
function makeUser(){
    return {
        name:"John",
        ref:this
    };
};

let user = makeUser();
alert(user.ref.name);  //undefined
```

```
function makeUser(){
    return {
        name:"John",
        ref(){
            return this;
        }
    };
};

let user = makeUser();
alert(user.ref().name);//John
```