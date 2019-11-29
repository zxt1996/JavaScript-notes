function makeCounter(){
    let count = 0;

    function counter(){
        return count++;
    }

    counter.set = value => count = value;

    counter.decrease = () => count--;

    return counter;
}

let counter = makeCounter();
  
console.log( counter() ); // 0
console.log( counter() ); // 1

counter.set(10); // set the new count

console.log( counter() ); // 10

counter.decrease(); 

console.log( counter() );