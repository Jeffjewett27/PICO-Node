import { id } from './socket/config.js'

export default class PicoController {
    constructor(verbose=false) {
        this.verbose = verbose;

        this.inputBuffer = [];
        this.initializationStatus = false;
        this.blockingStatus = false;
        this.queuedCommands = [];
        this.gameData = this.gameData = { 
            event: 'step',
            screen: ''
        };
        this.onSend = (_) => {};
        this.onReceiveCommands = (_) => {};
        this.onBlockChange = (_) => {}

        this.maxMissedFrames = Infinity;
        this.missedFrames = 0;
        this.skipframes = 0;
        this.numFramesSkipped = 0;
    }

    get isInitialized() {
        return this.initializationStatus;
    }

    initialize() {
        if (this.verbose) console.log("[PicoGym] PICO-8 initialized");
        this.initializationStatus = true;
        this.onSend({
            event: 'init',
            id: id
        })
    }

    reset() {
        if (this.verbose) console.log("[PicoGym] PICO-8 reset");
        this.onSend({
            event: 'reset',
            screen: ''
        })
    }

    get isBlocking() {
        return this.blockingStatus;
    }

    block() {
        this.blockingStatus = true;
        this.onBlockChange(true, this.verbose);
    }

    unblock() {
        this.blockingStatus = false;
        this.onBlockChange(false, this.verbose);
    }

    popInputBuffer() {
        if (this.inputBuffer.length == 0) {
            this.missedFrames++;
            if (this.missedFrames >= this.maxMissedFrames) this.block();
            console.error("[PicoGym] A frame without input slipped by.");
            return 0;
        }
        if (this.skipframes > 0) {
            return this.inputBuffer[0]
        }
        // if (this.skipframes > 0) {
        // }
        return this.inputBuffer.shift();
    }

    getController(button_i=0) {
        if (!this.isInitialized || button_i > 0) return 0;
        
        let input = this.popInputBuffer();
        if (this.verbose) console.log(`[PicoGym] Processing Controls: ${input}`);
        return input;
    }
      
    getCommands() {
        if (this.verbose && this.queuedCommands.length > 0)
            console.log(`[PicoGym] Processing Requests: ${this.queuedCommands}`);
        
        let serialized = this.queuedCommands.map((val)=>Object.values(val).join(",")).join(";");
        this.queuedCommands = [];
        return serialized;
    }
      
    queueGameMessage(type, message) {
        if (this.verbose) console.log(`[PicoGym] Queued Game Message: ${type}=${message}`);
        this.gameData[type] = message;
    }
      
    queueScreen(screen) {
        if (this.verbose) console.log("[PicoGym] Queue Screen");
        this.gameData.screen = screen;
    }

    sendGameData() {
        if (this.skipframes > 0) {
            this.skipframes--;
            this.numFramesSkipped++;
            return;
        }
        if (this.verbose) console.log("[PicoGym] Sent Game Data");
        this.block();
        this.onSend(this.gameData);
        this.gameData = { 
            event: 'step',
            screen: '',
            skipped: this.numFramesSkipped
        };
        this.numFramesSkipped = 0;
    }

    queueScreenAndSend(screen) {
        if (!this.isInitialized) return;
        this.queueScreen(screen);
        this.sendGameData();
    }

    processReceivedCommands(commands) {
        this.queuedCommands = this.queuedCommands.concat(commands);
    }

    onReceive(data) {
        console.log("on receive")
        console.log(data)
        if ('input' in data) {
            this.inputBuffer.push(data.input);
            this.skipframes = data.skipframes || 0;
            // for (let i = 0; i < this.skipframes; i++) {
            //     this.inputBuffer.push(data.input);
            // }
        }
        if (data.step) this.gameData.step = data.step;
        if (Array.isArray(data.commands)) {
            // this.onReceiveCommands(data.commands);
            // data.commands.forEach(element => {
            //     if (element.type == 'reset') this.reset()
            // });
            data.commands.forEach((command) => {
                console.log(command);
                if (command.type) this.queuedCommands.push(command);
            })
        }
        if (this.isBlocking) this.unblock();
    }
}