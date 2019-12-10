(function(){
    //将this赋值给局部变量root
    //root的值，客户端为window,服务端node中为exports
    var root = this;

    //将原来全局环境中的变量‘_’赋值给变量previousUnderscore进行缓存
    var previousUnderscore = root._;

    //缓存变量，便于压缩代码
    //此处压缩指的是压缩到min.js版本
    //而不是gzip压缩
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    //缓存变量，便于压缩代码
    //同时可减少在原型链中的查找次数(提高代码效率)
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    //ES5原生方法，如果浏览器支持，则underscore中会优先使用
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    var Ctor = function(){};

     // 核心函数
    // `_` 其实是一个构造函数
    // 支持无 new 调用的构造函数（思考 jQuery 的无 new 调用）
    // 将传入的参数（实际要操作的数据）赋值给 this._wrapped 属性
    // OOP 调用时，_ 相当于一个构造函数
    // each 等方法都在该构造函数的原型链上
    // _([1, 2, 3]).each(alert)
    // _([1, 2, 3]) 相当于无 new 构造了一个新的对象
    // 调用了该对象的 each 方法，该方法在该对象构造函数的原型链上
    var _ = function(obj){
        //以下均针对OOP形式的调用
        //如果是非OOP形式的调用，不会进入该函数内部

        //如果obj已经是‘_’函数的实例，则直接返回obj
        if(obj instanceof _){
            return obj;
        }

        //如果不是'_'函数的实例
        //则调用new运算符，返回实例化的对象
        if(!(this instanceof _)){
            return new _(obj);
        }

        //将obj赋值给this._wrapped属性
        this._wrapped = obj;
    };

    // 将上面定义的 `_` 局部变量赋值给全局对象中的 `_` 属性
    // 即客户端中 window._ = _
    // 服务端(node)中 exports._ = _
    // 同时在服务端向后兼容老的 require() API
    // 这样暴露给全局后便可以在全局环境中使用 `_` 变量(方法)
    if(typeof exports !== 'undefined'){
        if(typeof module !== 'undefined' && module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

    //当前underscore版本号
    _.VERSION = '1.8.3';

    // underscore 内部方法
    // 根据 this 指向（context 参数）
    // 以及 argCount 参数
    // 二次操作返回一些回调、迭代方法

    var optimizeCb = function(func,context,argCount){
        //如果没有指定this指向，则返回原函数
        //void 0相当于undefined
        if(context === void 0){
            return func;
        }

        switch(argCount == null ? 3 :argCount){
            case 1:return function(value){
                return func.call(context,value);
            };
            case 2:return function(value,other){
                return func.call(context,value,other);
            };

            //如果有指定this,但没有传入argCount参数
            //则执行以下case
            //_.each、_.map
            case 3:return function(value,index,collection){
                return func.call(context,value,index,collection);
            };

            //_.reduce、_.reduceRight
            case 4:return function(accumulator,value,index,collection){
                return func.call(context,accumulator,value,index,collection);
            };
        }

        // 其实不用上面的 switch-case 语句
        // 直接执行下面的 return 函数就行了
        // 不这样做的原因是 call 比 apply 快很多
        // .apply 在运行前要对作为参数的数组进行一系列检验和深拷贝，.call 则没有这些步骤
        return function(){
            return func.call(context,arguments);
        };
    };

    var cb = function(value,context,argCount){
        if(value == null){
            return _.identity;
        }
        if(_.isFunction(value)){
            return optimizeCb(value,context,argCount);
        }
        if(_.isObject(value)){
            return _.matcher(value);
        }
        return _.property(value);
    };

    _.iteratee = function(value,context){
        return cb(value,context,Infinity);
    };

    // 有三个方法用到了这个内部函数
    // _.extend & _.extendOwn & _.defaults
    // _.extend = createAssigner(_.allKeys);
    // _.extendOwn = _.assign = createAssigner(_.keys);
    // _.defaults = createAssigner(_.allKeys, true);
    var createAssigner = function(keysFunc,undefinedOnly){
        //返回函数
        //经典闭包(undefinedOnly参数在返回的函数中被引用)
        //返回的函数参数个数>=1
        //将第二个开始的对象参数的键值对'继承'给第一个参数
        return function(obj){
            var length = arguments.length;
            //只传入一个参数或0个
            //或传入的第一个参数是null
            if(length < 2 || obj == null){
                return obj;
            }

            //枚举第一个参数除外的对象参数
            //即arguments[1],arguments[2]...
            for(var index = 1;index<length;index++){
                //source即为对象参数
                var source = arguments[index],
                    //提取对象参数的keys值
                    //keysFunc参数表示_.keys
                    //或_.allKeys
                    keys = keysFunc(source),
                    l = keys.length;

                //遍历该对象的键值对
                for(var i=0;i<l;i++){
                    var key = keys[i];
                    // _.extend 和 _.extendOwn 方法
                    // 没有传入 undefinedOnly 参数，即 !undefinedOnly 为 true
                    // 即肯定会执行 obj[key] = source[key]
                    // 后面对象的键值对直接覆盖 obj
                    // ==========================================
                    // _.defaults 方法，undefinedOnly 参数为 true
                    // 即 !undefinedOnly 为 false
                    // 那么当且仅当 obj[key] 为 undefined 时才覆盖
                    // 即如果有相同的 key 值，取最早出现的 value 值
                    // *defaults 中有相同 key 的也是一样取首次出现的
                    if(!undefinedOnly || obj[key] === void 0){
                        obj[key] = source[key];
                    }
                }

                //返回已经继承后面对象参数属性的第一个参数对象
                return obj;
            };
        };

        var baseCreate = function(prototype){
            //如果prototype参数不是对象
            if(!_.isObject(prototype)){
                return {};
            }

            //如果浏览器支持ES5 Object.create
            if(nativeCreate){
                return nativeCreate(prototype);
            }

            Ctor.prototype = prototype;
            var result = new Ctor;
            Ctor.prototype = null;
            return result;
        };

        //闭包
        var property = function(key){
            return function(obj){
                return obj == null ? void 0 : obj[key];
            };
        };

        // Math.pow(2, 53) - 1 是 JavaScript 中能精确表示的最大数字

        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

        //getLength函数
        //该函数传入一个参数，返回参数的length属性值
        //用来获取array以及arrayLike元素的length属性值
        var getLength = property('length');

        // 判断是否是 ArrayLike Object
        // 类数组，即拥有 length 属性并且 length 属性值为 Number 类型的元素
        // 包括数组、arguments、HTML Collection 以及 NodeList 等等
        // 包括类似 {length: 10} 这样的对象
        // 包括字符串、函数等
        var isArrayLike = function(collection){
            //返回参数collection的length属性值
            var length = getLength(collection);
            return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
        };

         // 数组或者对象的扩展方法
        // 共 25 个扩展方法
        // --------------------

        // 与 ES5 中 Array.prototype.forEach 使用方法类似
        // 遍历数组或者对象的每个元素
        // 第一个参数为数组（包括类数组）或者对象
        // 第二个参数为迭代方法，对数组或者对象每个元素都执行该方法
        // 该方法又能传入三个参数，分别为 (item, index, array)（(value, key, obj) for object）
        // 与 ES5 中 Array.prototype.forEach 方法传参格式一致
        // 第三个参数（可省略）确定第二个参数 iteratee 函数中的（可能有的）this 指向
        // 即 iteratee 中出现的（如果有）所有 this 都指向 context
        // notice: 不要传入一个带有 key 类型为 number 的对象！
        // notice: _.each 方法不能用 return 跳出循环（同样，Array.prototype.forEach 也不行）
        _.each = _.forEach = function(obj,iteratee,context){
            //根据context确定不同的迭代函数
            iteratee = optimizeCb(iteratee,context);

            var i,length;

            //如果是类数组
            //默认不会传入类似{length:10}这样的数据
            if(isArrayLike(obj)){
                //遍历
                for(i = 0,length=obj.length;i<length;i++){
                    iteratee(obj[i],i,obj);
                }
            }else{
                //如果obj是对象
                //获取对象的所有key值
                var keys = _.keys(obj);

                //如果是对象，则遍历处理values值
                for(i = 0,length=keys.length;i<length;i++){
                    iteratee(obj[keys[i]],keys[i],obj);//(value,key,obj)
                }
            }

            // 返回 obj 参数
            // 供链式调用（Returns the list for chaining）
            // 应该仅 OOP 调用有效
            return obj;
        };

        // 与 ES5 中 Array.prototype.map 使用方法类似
        // 传参形式与 _.each 方法类似
        // 遍历数组（每个元素）或者对象的每个元素（value）
        // 对每个元素执行 iteratee 迭代方法
        // 将结果保存到新的数组中，并返回
        _.map = _.collect = function(obj,iteratee,context){
            //根据context确定不同的迭代函数
            iteratee = cb(iteratee,context);

            //如果传参是对象，则获取它的keys值数组
            var keys = !isArrayLike(obj) && _.keys(obj),
                //如果obj为对象，则length为key.length
                //如果obj为数组，则length为obj.length
                length = (keys || obj).length,
                results = Array(length);//结果数组

            //遍历
            for(var index = 0;index < length;index++){
                // 如果 obj 为对象，则 currentKey 为对象键值 key
                // 如果 obj 为数组，则 currentKey 为 index 值
                var currentKey = keys ? keys[index] : index;
                results[index] = iteratee(obj[currentKey], currentKey, obj);
            }
                // 返回新的结果数组
                return results;
        }
    }
})