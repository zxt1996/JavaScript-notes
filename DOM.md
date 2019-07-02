## DOM
DOM 就是浏览器为 JavaScript 提供的一系列接口（通过 window.documnet 提供的），通过这些接口我们可以操作web页面。
## 节点
### 节点信息
- nodeName(节点名称)
- nodeValue(节点值)
- nodeType(节点类型)
### 1.元素节点  
    <html>、<body>、<p>等都是元素节点，即标签。
### 2.文本节点  
    向用户展示的内容，如<li>...<li>中的JavaScript、DOM、CSS等文本。
### 3.属性节点  
    元素属性，如<a>标签的链接属性href="http://www.baidu.com"。
## window.onload
onload事件会在整个页面加载完成后触发，为window绑定一个onload事件，该事件对应的响应函数将会在页面加载完成后执行，这样可以确保我们的代码执行时所有的DOM对象已经加载完毕了。

## DOM查询
### 获取元素节点
- 通过document对象调用
1. getElementById()  
-通过id属性获取一个元素节点对象
```
<p id="para">Some text here</p>
<button onclick="changeColor('blue');">blue</button>

function changeColor(newColor) {
​  var elem = document.getElementById('para');
  elem.style.color = newColor;
}
```
2. getElementsByTagName()  
-通过标签名获取一组元素节点对象
```
<p>Some outer text</p>
<p>Some outer text</p>
<div id="div2" style="border: solid red 3px">
      <p>Some div2 text</p>
      <p>Some div2 text</p>
</div>
<button onclick="getAllParaElems();">
    show all p elements in document</button><br />

function getAllParaElems() {
      var allParas = document.getElementsByTagName("p");
      var num = allParas.length;
      alert("There are " + num + " paragraph in this document");
    }

```
3. getElementsByName()  
-通过name属性获取一组元素节点对象
```
<body>
<form name="up"><input type="text"></form>
<div name="down"><input type="text"></div>

<script>
var up_forms = document.getElementsByName("up");
console.log(up_forms[0].tagName); // returns "FORM"
</script>
</body>
```
### 获取元素节点的子节点
- 通过具体的元素节点调用  
1. getElementsByTagName()  
-方法，返回当前节点的指定标签名后代节点
```
<p>Some outer text</p>
<p>Some outer text</p>
<div id="div2" style="border: solid red 3px">
      <p>Some div2 text</p>
      <p>Some div2 text</p>
</div>
<button onclick="div2ParaElems();">
    show all p elements in div2 element</button>
    
function div2ParaElems() {
      var div2 = document.getElementById("div2");
      var div2Paras = div2.getElementsByTagName("p");
      var num = div2Paras.length;
      alert("There are " + num + " paragraph in #div2");
    }
```
2. childNodes  
-属性，表示当前节点的所有子节点。  
集合中的节点按照它们在源代码中出现的顺序进行排序，并且可以通过索引号进行访问。索引从0开始。
```
获取<body>元素的子节点的集合：  
var c = document.body.childNodes;
```
3. firstChild  
-属性，表示当前节点的第一个子节点 
```
<ul id="myList"><li>Coffee</li><li>Tea</li></ul>
<p id="demo"></p>

<script>
function myFunction() {
  var list = document.getElementById("myList").firstChild.innerHTML;    //Coffee
  document.getElementById("demo").innerHTML = list;
}
</script>
```
3. lastChild  
-属性，表示当前节点的最后一个子节点
```
<ul id="myList"><li>Coffee</li><li>Tea</li></ul>
<p id="demo"></p>

<script>
function myFunction() {
  var list = document.getElementById("myList").lastChild.innerHTML;        //Tea
  document.getElementById("demo").innerHTML = list;
}
</script>
```
### 获取父节点和兄弟节点
- 通过具体的节点调用
1. parentNode  
-属性，表示当前节点的父节点
```
<ul>
  <li id="myLI">Coffee</li>
  <li>Tea</li>
</ul>
<p id="demo"></p>

<script>
function myFunction() {
  var x = document.getElementById("myLI").parentNode.nodeName;  //UL
  document.getElementById("demo").innerHTML = x;
}
</script>
```
2. previousSibling  
-属性，表示当前节点的前一个兄弟节点
```
<ul><li id="item1">Coffee (first li)</li><li id="item2">Tea (second li)</li></ul>

<p id="demo"></p>

<script>
function myFunction() {
  var x = document.getElementById("item2").previousSibling.innerHTML;              //Coffee (first li)
  document.getElementById("demo").innerHTML = x;
}
</script>
```
3. nextSibling  
-属性，表示当前节点的后一个兄弟节点
```
<ul><li id="item1">Coffee (first li)</li><li id="item2">Tea (second li)</li></ul>

<p id="demo"></p>

<script>
function myFunction() {
  var x = document.getElementById("item1").nextSibling.innerHTML;             //Tea (second li)
  document.getElementById("demo").innerHTML = x;
}
</script>
```
### 查询的其他方法
- 获取body标签
```
var body = document.getElementsByTagName("body")[0];

var body = document.body;
```
- 获取html根标签
```
var html = document.documentElement;
```
- 获取页面所有元素
```
var all = document.all;

all = document.getElementsByTagName("*");
```
- 使用CSS选择器进行查询
1. querySelector()  
2. querySelectorAll()  
 这两个方法都是用document对象来调用，两个方法使用相同， 都是传递一个选择器字符串作为参数，方法会自动根据选择器 字符串去网页中查找元素。   
 不同的地方是querySelector()只会返回找到的第一个元素，而 querySelectorAll()会返回所有符合条件的元素，作为静态NodeList对象。
 ```
 <h2 class="example">A heading with class="example"</h2>
<p class="example">A paragraph with class="example".</p> 

<button onclick="myFunction()">Try it</button>
//只有h2会变红色
<script>
function myFunction() {
  document.querySelector(".example").style.backgroundColor = "red";
}
</script>

 ```
 ```
 <h2 class="example">A heading with class="example"</h2>
<p class="example">A paragraph with class="example".</p> 

<p>Click the button to add a background color to the first element in the document with class="example" (index 0).</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction() {
  var x = document.querySelectorAll(".example");
  x[0].style.backgroundColor = "red";
}
</script>
 ```

 ## 节点的修改
 1. 创建节点  
 - document.createElement
 - document.createTextNode //创建文本
 ```
 var el1 = document.createElement('div');
var el2 = document.createElement('input');
var node = document.createTextNode('hello world!');
 ```
 2. 删除节点
 - 父节点.removeChild(子节点)
 ```
 ele.removeChild(el);
 ```
 3. 替换节点
 - 父节点.replaceChild(新节点,旧节点)
 ```
 ele.replaceChild(el1, el2);
 ```
 4. 插入节点
 - 父节点.appendChild(子节点)
 - 父节点.insertBefore(新节点,旧节点)
 ```
 ele.appendChild(el);

 parentElement.insertBefore(newElement, referenceElement);
 ```
 ## 属性操作
 ```
 // 获取一个{name, value}的数组
var attrs = el.attributes;

// 获取、设置属性
var c = el.getAttribute('class');
el.setAttribute('class', 'highlight');

// 判断、移除属性
el.hasAttribute('class');
el.removeAttribute('class');

// 是否有属性设置
el.hasAttributes(); 
 ```