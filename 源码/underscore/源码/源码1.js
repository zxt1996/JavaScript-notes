(function(){
    // 设配不同环境，将this赋值给局部变量root
    var root = (typeof self == 'object' && self.self == self && self) ||
     (typeof global == 'object' && global.global == global && global) ||
      this || {};

    var ArrayProto = Array.prototype;

    var push = ArrayProto.push;

    //将自定义的函数定义在 _ 函数上
    var _ = function(obj){
        // 如果obj已经是`_`函数的实例，则直接返回obj
        if(obj instanceof _)return obj;

        // 执行 this instanceof _，this 指向 window ，window instanceof _ 为 false，!操作符取反
        // 调用new运算符，返回实例化的对象
        // _([1, 2, 3]) 相当于无 new 构造了一个新的对象
        if(!(this instanceof _))return new _(obj);

        // 将 obj 赋值给 this._wrapped 属性
        this._wrapped = obj;
    }

    // 将上面定义的 `_` 局部变量赋值给全局对象中的 `_` 属性
    // 这样暴露给全局后便可以在全局环境中使用 `_` 变量(方法)
    // 适配不同环境
    if(typeof exports != 'undefined' && !exports.nodeType){
        if(typeof module != 'undefined' && !module.nodeType && module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

    // 当前 underscore 版本号
    _.VERSION = '0.1';

    var MAX_ARRAY_INDEX = Math.pow(2,53) - 1;

    var isArrayLike = function(collection){
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = function(obj,callback){
        var length,i = 0;

        if(isArrayLike(obj)){
            length = obj.length;
            for(;i<length;i++){
                if(callback.call(obj[i],obj[i],i)===false){
                    break;
                }
            }
        }else{
            for(i in obj){
                if(callback.call(obj[i],obj[i],i)===false){
                    break;
                }
            }
        }
        return obj;
    }

    _.isFunction = function(obj){
        return typeof obj == 'function' || false;
    };

    _.functions = function(obj){
        var names = [];
        for(var key in obj){
            if(_.isFunction(obj[key]))names.push(key);
        }
        return names.sort();
    };

    /**
     * 在 _.mixin(_) 前添加自己定义的方法
     */
    _.reverse = function(string){
        return string.split('').reverse().join('');
    }

    _.mixin = function(obj){
         // 遍历 obj 的 key，将方法挂载到 Underscore 上
        // 其实是将方法浅拷贝到 _.prototype 上
        _.each(_.functions(obj),function(name){
            // 直接把方法挂载到 _[name] 上
            var func = _[name] = obj[name];

            // 浅拷贝
            // 将 name 方法挂载到 _ 对象的原型链上，使之能 OOP 调用
            _.prototype[name] = function(){
                var args = [this._wrapped];

                push.apply(args,arguments);

                return func.apply(_,args);
            };
        });
        return _;
    };

    // 将前面定义的 underscore 方法添加给包装过的对象
    // 即添加到 _.prototype 中
    // 使 underscore 支持面向对象形式的调用
    _.mixin(_);
})()