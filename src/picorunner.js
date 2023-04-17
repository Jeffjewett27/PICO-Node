import fs from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import PicoController from "./picocontroller.js";
import { socketConnectAndGetRequester, socketSend } from './socket/pico_client.js';

// const { connectPromise } = socketConnect();
// let connection = null;
// let requester = null;
// connectPromise.then((conn) => {
//   connection = conn;
// });
let requester = null;
socketConnectAndGetRequester().then((req) => {
  console.log("requester acquired");
  requester = req
}).catch((err) => console.error(err));

const controller = new PicoController(false);

controller.onSend = (data) => {
  if (requester) {
    socketSend(requester, data, controller.onReceive.bind(controller));
  } else {
    // connectPromise.then((conn) => socketSend(conn, data, controller.onReceive.bind(controller)));
  }
}

// setTimeout(controller.onSend, 3000);
// setTimeout(controller.onSend, 3500);
// setTimeout(controller.onSend, 4000);

let dummyUrl = "http://localhost";
class CustomResourceLoader extends jsdom.ResourceLoader {

    fetch(url, options) {
        if (url === `${dummyUrl}/dist/main.js`) {
            console.log("fetching bundle");
            return fs.promises.readFile("./dist/null.js");
        }

        if (url === `${dummyUrl}/testjs.js`) {
            return new Promise((resolve, _) => {
              let js = fs.readFileSync("./testjs.js").toString();
              //remove problematic filesystem function
              js = js.replace(/function mkdir_0((.*(\n|\r|\r\n)){29})/, 
                `console.log("Could not load filesystem");`);
              let buf = Buffer.from(js, 'utf8');
              fs.writeFile("standalone.js", buf, ()=>{});
              resolve(buf);
            })
        }
  
      return super.fetch(url, options);
    }
  }

const resourceLoader = new CustomResourceLoader();
  
let html = fs.readFileSync("./carts/testjs.html").toString();
console.log("AudioContext".replace(/AudioContext/, 'ferret'));
html = html
  //AudioContext is not defined, and was used to trigger game start
  .replace("AudioContext();", 'Object(); p8_run_cart();') 
  //pico8_gpio overrides the variable defined in communic8
  .replace(/pico8_gpio/g, "pico8_gpioOld")
  //autoplay
  .replace("p8_autoplay = false", "p8_autoplay = true")
  //insert script before other script
  .replace(/\s(?=\<script)/, `<script type="text/javascript" src="dist/main.js"></script>`);
  // .replace("var pico8_buttons", "//");
fs.writeFile("standalone.html", html, ()=>{});

const dom = new JSDOM(html, {
    url: dummyUrl,
    runScripts: "dangerously", 
    pretendToBeVisual: true, 
    resources: "usable",
    resources: resourceLoader,
    beforeParse(window) {
      window.picoController = controller
    }
});