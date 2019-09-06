# 模块 Modules
## 1.命名导出（Named exports）
用花括号来导入模块。
```
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main.js ------
import { square, diag } from 'lib';				
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5

```
- Export 列表
```
    export {detectCats, Kittydar};
    // 此处不需要 `export`关键字 
    function detectCats(canvas, options) { ... }
    class Kittydar { ... }
```
- 重命名 import 和 export
```
    // suburbia.js
    // 这两个模块都会导出以`flip`命名的东西。
    // 要同时导入两者，我们至少要将其中一个的名称改掉。
    import {flip as flipOmelet} from "eggs.js";
    import {flip as flipHouse} from "real-estate.js";
    ...
```
## 2.默认导出（Default exports）
```
// A.js
export default 42
export const myA = 43
export const Something = 44

// B.js
import A, { myA, Something } from './A'
```
默认导出与其它类型的导出相似，唯一的不同之处是它被命名为“default”。  
关键字export default后可跟随任何值：一个函数、一个类、一个对象字面量，只要你能想到的都可以。  
不用花括号来导入模块。
- 模块对象
```
import * as cow from './cow.js'
import * as goat from './goat.js'

cow.speak() // moo
goat.speak() // baa

```
当你import *时，导入的其实是一个模块命名空间对象，模块将它的所有属性都导出了。
## 使用
模块a:
```
export var a = 1;
export function modify(){
    a = 2;
}
```
模块 b:
```
import {a,modify}from "./a.js";

console.log(a);
modify();
console.log(a);
```
当我们调用修改变量的函数后，b模块变量也跟着发生了改变，这说明导入与一般的赋值不同，导入后的变量只是改变了名字，它仍然与原来的变量是同一个。
```
var a = {};
export default a;
```
这里的行为跟导出变量是不一致的，这里导出的是值，导出的就是普通变量a的值，以后a的变化与导出的值就无关了，修改变量a，不会使得其他模块中引入的default值发生改变。