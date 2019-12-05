# Object.create()实现深拷贝
```
function deepClone(initalObj,finalObj){
    var obj = finalObj || {};
    for(var i in initalObj){
        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
        var prop = initalObj[i];
        if(prop === obj){
            continue;
        }
        if(typeof prop === 'object'){
            obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
        }else{
            obj[i] = prop;
        }
    }
    return obj;
}
```