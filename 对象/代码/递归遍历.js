//获得所有薪酬总数

let company = { // 是同样的对象，简洁起见做了压缩
    sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 600 }],
    development: {
      sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
      internals: [{name: 'Jack', salary: 1300}]
    }
  };

function sumSalaries(department){
    if(Array.isArray(department)){
        return department.reduce((prev,current)=>prev+current.salary,0);//求数组的和
    }else{
        let sum = 0;
        for(let subdep of Object.values(department)){
            sum += sumSalaries(subdep);//递归调用子部门，对结果求和
        }
        return sum;
    }
}

console.log(sumSalaries(company));