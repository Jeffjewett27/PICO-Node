import fs from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import PicoController from "./picocontroller.js";
import { socketConnectAndGetRequester, socketSend } from './socket/pico_client.js';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv))
    .option('cart', {
    alias: 'c',
    type: 'string',
    description: "Exported PICO-8 cart name. Ex: 'celeste' loads 'celeste.html' and 'celest.js"
  }).argv

let { cart = 'celeste' } = argv; 

let requester = null;
let connectionAttempts = 5;
socketConnectAndGetRequester().then((req) => {
  console.log("requester acquired");
  requester = req
}).catch((err) => console.error(err));

const controller = new PicoController(false);

controller.onSend = (data) => {
  if (requester) {
    console.log("[SENDING] test");
    socketSend(requester, data, controller.onReceive.bind(controller));
  } else {
    console.warn("[PicoGym] Tried to send data, but connection not ready");
    if (connectionAttempts-->0) setTimeout(()=>controller.onSend(data), 1000);
  }
}

let dummyUrl = "http://localhost";
class CustomResourceLoader extends jsdom.ResourceLoader {

    fetch(url, options) {
        if (url === `${dummyUrl}/dist/main.js`) {
            console.log("fetching bundle");
            return fs.promises.readFile("./dist/null.js");
        }

        if (url === `${dummyUrl}/${cart}.js`) {
            return new Promise((resolve, _) => {
              let js = fs.readFileSync(`./carts/${cart}.js`).toString();
              //remove problematic filesystem function
              js = js.replace(/function mkdir_0((.*(\n|\r|\r\n)){29})/, 
                `console.log("Could not load filesystem");`);
              js = js.replace("pico8_gpio[$0] = $1", 
                `{ window.gpioHook($0, $1); pico8_gpio[$0] = $1; }`);
              js = js.replace("val = pico8_buttons[button_i];", 
                `{ pico8_buttons[button_i] = window.picoController.getController(button_i); val = pico8_buttons[button_i]; }`);
              js = js.replace("window.location.hostname", "window.picoController.getCommands()");
              let buf = Buffer.from(js, 'utf8');
              fs.writeFile("dist/standalone.js", buf, ()=>{});
              resolve(buf);
            })
        }
  
      return super.fetch(url, options);
    }
  }

const resourceLoader = new CustomResourceLoader();
  
let html = fs.readFileSync(`./carts/${cart}.html`).toString();
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
fs.writeFile("dist/standalone.html", html, ()=>{});

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