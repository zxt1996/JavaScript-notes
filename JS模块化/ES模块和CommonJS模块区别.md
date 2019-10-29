- CommonJS模块输出的是一个值的**拷贝**
- ES模块输出的是值得**引用**  

```
//data.js
export let data = 'data';
export function modifyData(){
    data = 'modified data';
}

//index.js
import { data,modifyData } from './lib'
console.log(data);//data
modifyData();
console.log(data);//modified data
```
commonJs
```
//data.js
var data = 'data';
function modifyData(){
    data = 'modified data';
}

module.exports = {
    data:data,
    modifyData:modifyData
}

//index.js
var data = require('./data').data;
var modifyData = require('./data').modifyData;
console.log(data);//data
modifyData();
console.log(data);//data
```

### ES模块的静态性带来了限制
- 只能在文件顶部import依赖
- export导出的变量类型严格限制
- 变量不允许被重新绑定，import的模块名只能是字符穿变量，即不可以动态确定依赖