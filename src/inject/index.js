import "core-js/stable";
import "regenerator-runtime/runtime";

(typeof window !== 'undefined' ? window : global).pico8_gpio = new Array(128).fill(0);

///Environment Overrides
var DateStartTime = Date.now();
var OldDateNowFunc = Date.now;
Date.now = () => {
    var curDate = OldDateNowFunc();
    var diff = curDate - DateStartTime;
    return DateStartTime + 32 * diff; //speed up time
}
navigator.getGamepads = () => [];

var funcTracker = {};
document.trackFunc = function trackFunc(name) {
    if (!funcTracker[name]) funcTracker[name] = 0;
    funcTracker[name]++;
}
setInterval(() => {
    if (Object.keys(funcTracker).length)
        console.log(funcTracker);
    funcTracker = {};
}, 1000);

var oldConsoleLog = console.log;
const msgPattern = /\[(\w+)\]\s*(.*)/;
console.log = (msg) => {
    let match = msg.match(msgPattern);
    // oldConsoleLog("MATCH")
    // oldConsoleLog(match)
    if (match) {
        let type = match[1];
        let data = match[2];
        if (type != 'codo' && type != 'PicoGym') 
            picoController.queueGameMessage(type, data);
        }
        oldConsoleLog(msg);
}

console.log("[Index.js] Run");

document.getElementById("codo_textarea").display = "block";
document.getElementById("codo_textarea").value = "block";

picoController.onBlockChange = (val, verbose=false) => {
    if (val) {
        if (verbose) console.log("[PicoGym] Paused PICO-8");
        Browser.mainLoop.pause();
    } else {
        if (verbose) console.log("[PicoGym] Resumed PICO-8");
        Browser.mainLoop.resume();
    }
}

window.gameMessage = "default message";
setTimeout(()=>{
    window.gameMessage = "changed message";
}, 6000);

window.gpioHook = function($0, $1) {
    if (!$1 || $0 < 124) return;
    console.log(`gpiohook: ${$0}, ${$1}`)
    if ($0 == 127) { //poke(0x5fff,_) -> initialize hook
        picoController.initialize();
    } else if ($0 == 126) { //poke(0x5ffe,_) -> update hook (start of frame)
        picoController.getCommands();
    } else if ($0 == 125) { //poke(0x5ffd,_) -> draw hook (end of frame)
        picoController.queueScreenAndSend(Module.canvas.toDataURL());
    }
}

setTimeout(() => {
    Browser.mainLoop.pause();
    Browser.mainLoop.timingMode = 2;
    Browser.mainLoop.resume();
}, 30);
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