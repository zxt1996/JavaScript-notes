function f(x) {
    alert(x);
  }
  
// function delay(f,ms){
//     return function(){
//         setTimeout(()=> f.apply(this,arguments),ms);
//     };
// }

function delay(f,ms){
    return function(...args){
        let savedThis = this;
        setTimeout(function(){
            f.apply(savedThis,args);
        },ms);
    };
}
  // create wrappers
  let f1000 = delay(f, 1000);
  let f1500 = delay(f, 1500);
  
  f1000("test"); // 在 1000 ms 后展示 "test"
  f1500("test"); // 在 1500 ms 后展示 "test"