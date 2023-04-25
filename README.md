
<h1 align="center">
  <br>
  <img src="media/piconode.png" alt="PICO-Node" width="200"></a>
  <br>
  PICO-Node
  <br>
</h1>

<h4 align="center">A PICO-8 Environment that runs in <a href="https://nodejs.org/" target="_blank">Node.js</a>.</h4>

<!-- <p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  </a>
  <a href="https://gitter.im/amitmerchant1990/electron-markdownify"><img src="https://badges.gitter.im/amitmerchant1990/electron-markdownify.svg"></a>
  <a href="https://saythanks.io/to/bullredeyes@gmail.com">
      <img src="https://img.shields.io/badge/SayThanks.io-%E2%98%BC-1EAEDB.svg">
  </a>
  <a href="https://www.paypal.me/AmitMerchant">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p> -->

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#interface">Interface</a> •
  <a href="#websocket-communications">Websocket Communications</a> •
  <a href="#credits">Credits</a> •
  <a href="#contribute">Contribute</a> •
  <a href="#license">License</a>
</p>

<!-- ![screenshot](https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.gif) -->

## Key Features

* Runs exported PICO-8 carts without a browser
  - Carts must be exported with `export name.html`
* Hijacks system calls to allow JavaScript to interface with the PICO-8 program
  - Cart must implement the interface described in <a href="#interface">Interface</a>
* Websocket client enables communications with <a href="https://github.com/Jeffjewett27/PICO-Gym">PICO-Gym</a>

## How To Use

```bash
# Clone this repository
$ git clone https://github.com/Jeffjewett27/PICO-Node

# Go into the repository
$ cd PICO-Node

# Install dependencies
$ npm install

# Run a cart
$ node src/picorunner.js -c cartpole
```

<!-- > **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt. -->

## Interface

PICO-8 games must include several lines of Lua to interface with the JavaScript.

```
commands = {}

function process_commands()
		local cmdstr = stat(102)
		if cmdstr == 0 or #cmdstr == 0 then
				return
		end
		local cmdlist = split(cmdstr,";")
		for cmd in all(cmdlist) do
				local args = split(cmd)
				
				if commands[args[1]] != nil then
						printh(args[1])
						commands[args[1]](args)
				end
		end
end

function _init()
    poke(0x5fff,1) -- signal JS initialization
    ...
end

function _update()
    process_commands() -- check for commands
    ...
end

function _draw()
    ...
    poke(0x5ffd,1)
end
```

You can add command hooks like this:

```
commands["reset"]=function(args)
	-- args = ["reset","arg1","arg2","..."]
    printh("[event] reset")
end
```

## Websocket Communications

To communicate with PICO-Gym, the websocket client emits messages. The API is described in PICO-Gym

## Credits

- [PICO-8](https://www.lexaloffle.com/pico-8.php) (Lexaloffle)
- [jsdom](https://github.com/jsdom/jsdom)

## Contribute

Contributions to the project are welcome. If there is interest, I can set up communication channels.

<!-- <a href="https://www.buymeacoffee.com/5Zn8Xh3l9" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<p>Or</p> 

<a href="https://www.patreon.com/amitmerchant">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## You may also like...

- [Pomolectron](https://github.com/amitmerchant1990/pomolectron) - A pomodoro app
- [Correo](https://github.com/amitmerchant1990/correo) - A menubar/taskbar Gmail App for Windows and macOS -->

## License

MIT

---

<!-- > [amitmerchant.com](https://www.amitmerchant.com) &nbsp;&middot;&nbsp; -->
GitHub [@JeffJewett27](https://github.com/JeffJewett27) <!-- &nbsp;&middot;&nbsp; -->
<!-- > Twitter [@amit_merchant](https://twitter.com/amit_merchant) -->

