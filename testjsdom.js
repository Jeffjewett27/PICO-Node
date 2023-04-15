const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var dummyUrl = "http://localhost/";

class CustomResourceLoader extends jsdom.ResourceLoader {
    fetch(url, options) {
        if (url === `${dummyUrl}/dist/bundle.js`) {
            console.log("fetching bundle");
            return fs.promises.readFile("./dist/bundle.js");
        }

        if (url === `${dummyUrl}/testjs.js`) {
            console.log("fetching pico code");
            // return fs.promises.readFile("./testjs.js");
            return new Promise((resolve, _) => {
              let js = fs.readFileSync("./testjs.js").toString();
              //remove problematic filesystem function
              js = js.replace(/function mkdir_0((.*(\n|\r|\r\n)){29})/, 
                `console.log("Could not load filesystem");`);
              let buf = Buffer.from(js, 'utf8');
              resolve(buf);
            })
        }
  
      return super.fetch(url, options);
    }
  }

const resourceLoader = new CustomResourceLoader();
// const virtualConsole = new jsdom.VirtualConsole();
  
html = fs.readFileSync("./carts/testjs.html").toString();
console.log("AudioContext".replace(/AudioContext/, 'ferret'));
html = html
  //AudioContext is not defined, and was used to trigger game start
  .replace("AudioContext();", 'Object(); p8_run_cart();') 
  //pico8_gpio overrides the variable defined in communic8
  .replace(/pico8_gpio/g, "pico8_gpioOld")
  //autoplay
  .replace("p8_autoplay = false", "p8_autoplay = true")
  //insert script before other script
  .replace(/\s(?=\<script)/, `<script type="text/javascript" src="dist/bundle.js"></script>`);
  // .replace("var pico8_buttons", "//");
const dom = new JSDOM(html, {
    // virtualConsole: virtualConsole,
    url: dummyUrl,
    runScripts: "dangerously", 
    pretendToBeVisual: true, 
    resources: "usable",
    resources: resourceLoader 
});
// virtualConsole.on('info', () => { console.log("info")})
// virtualConsole.on('log', (val) => { console.log(`log: ${val}`)})