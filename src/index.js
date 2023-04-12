import "core-js/stable";
import "regenerator-runtime/runtime";
const Communic8 = require('communic8');

// console.log("test");

// var add = Comminuc8.RPC({
//     id: 0, // a unique byte to identify the RPC
//     input: [
//         ArgTypes.Byte,
//         ArgTypes.Byte
//     ],
//     output: [
//         ArgTypes.Byte
//     ]
// });

// var bridge = Communic8.connect();
// bridge.send(add(2, 3)).then((function(result) {
//     console.log("2 + 3 =", result[0]); // => "2 + 3 = 5"
// }));


const sayHello = () => {
    /*eslint-disable no-console */
    console.log("Allo! We are all set!");
    console.log("Arrow functions are working");
    console.log(Communic8);
};

sayHello();
