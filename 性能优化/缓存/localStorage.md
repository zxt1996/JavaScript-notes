# localStorage
**本地存储**

## 应用
- 缓存静态文件内容JS/CSS
- 缓存不常变更的API接口数据
- 存储地理位置信息
- 浏览在页面的具体位置
  
### 缓存静态文件内容JavaScript /CSS
```
//localFile.js
//版本控制
var script = document.getElementsByTagName("script");
for(var i = 0;i<script.length;i++){
    if(script[i].getAttribute("version")){
        if(script[i].getAttribute("version") != localStorage["version"]){
            localStorage.clear();
            localStorage["version"] = script[i].getAttribute("version");
        }
    }
}

//js
function loadJs(jsUrl){
    if(!localStorage[jsUrl]){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET',jsUrl,false);
        xmlhttp.send();
        localStorage[jsUrl] = xmlhttp.responseText;
    }
    return localStorage[jsUrl];
}

//img
function loadImg(img){
    if(img.getAttribute("lsrc")){
        if(!localStorage[img.getAttribute('lsrc')]){
            var x = new XMLHttpRequest();
            x.responseType = 'blob';
            x.open('GET',img.getAttribute('lsrc'),true);
            x.onreadystatechange = function(){
                if(x.readyState == 4){
                    var reader = new FileReader();
                    reader.readAsDataURL(x.response);
                    reader.onload = function(){
                        localStorage[img.getAttribute('lsrc')] = this.result;
                        img.src = this.result;
                    }
                }
            }
            x.send();
        }else{
            img.src = localStorage[img.getAttribute('lsrc')];
        }
    }
}

//css
function loadCss(url){
    if(!localStorage[url]){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET',url,false);
        xmlhttp.send();
        localStorage[url] = xmlhttp.responseText;
    }
    var s = document.createElement('style');
    s.innerHTML = localStorage[url];
    document.getElementsByTagName("head")[0].appendChild(s);
}
```
引入js:
```
<script src="js/localFile.js" version=12></script>
```
version为版本号，当版本号改变的时候，js会清空localStorage，执行的时候会重新载入全部资源。  

载入js:
```
<script>eval(loadJs("js/vue.min.js"));</script>
```
载入css:
```
<script>loadCss("style.css")</script>
```
载入图片
```
<img lsrc="img/top.png" src="" onerror="loadImg(this)" class="top" >
```
图片src为空，真实地址写在lsrc属性里。当图片读取""地址的时候，会出错，调用onerror从而执行函数载入图片数据。