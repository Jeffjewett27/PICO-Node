import "core-js/stable";
import "regenerator-runtime/runtime";
const Communic8 = require('./communic8.js');
// const Communic8 = require('communic8');

var DateStartTime = Date.now();
var OldDateNowFunc = Date.now;
Date.now = () => {
    var curDate = OldDateNowFunc();
    var diff = curDate - DateStartTime;
    return DateStartTime + 1 * diff;
}
navigator.getGamepads = () => [];

var funcTracker = {};
document.trackFunc = function trackFunc(name) {
    if (!funcTracker[name]) funcTracker[name] = 0;
    funcTracker[name]++;
}
setInterval(() => {
    console.log(funcTracker);
    funcTracker = {};
}, 1000);

console.log("test");

var add = Communic8.RPC({
    id: 0, // a unique byte to identify the RPC
    input: [
        Communic8.ArgTypes.Byte,
        Communic8.ArgTypes.Byte
    ],
    output: [
        Communic8.ArgTypes.Byte
    ]
});

var bridge = Communic8.connect();
var isPaused = false;
var count = 0;
var isInitialized = false;
var numSent = 0;

function request_calculation() {
    if (numSent > 1) return;
    console.log("sent query");
    numSent++;
    bridge.send(add(2, 3)).then((function(result) {
        document.trackFunc('lua_msg');
        isInitialized = true;
        count++;
        numSent--;
        console.log(`result: ${result[0]}, count: ${count}`); // => "2 + 3 = 5"
        request_calculation();
    }));
}
document.request_calculation = request_calculation;

bridge.send(add(7, 4)).then((function(result) {
    isInitialized = true;
    count++;
    console.log(`result: ${result[0]}, count: ${count}`); // => "2 + 3 = 5"
    // Browser.mainLoop.pause();
    // Browser.mainLoop.timingMode = 2;
    // Browser.mainLoop.resume();
    // setInterval(request_calculation, 2);
    // request_calculation();
}));
// setInterval(request_calculation, 100);
// console.dir(bridge);
// setInterval(() => {
//     if (!Browser) {
//         console.log("no browser");
//         return;
//     }
//     if (!isPaused) {
//         Browser.mainLoop.pause();
//         isPaused = true;
//     } else {
//         Browser.mainLoop.resume();
//         isPaused = false;
//     }
// }, 5000)