export default class PicoController {
    constructor(verbose=false) {
        this.verbose = verbose;

        this.inputBuffer = [];
        this.initializationStatus = false;
        this.blockingStatus = false;
        this.queuedCommands = [];
        this.gameData = {}
        this.onSend = (_) => {};
        this.onReceiveCommands = (_) => {};
        this.onBlockChange = (_) => {}
    }

    get isInitialized() {
        return this.initializationStatus;
    }

    initialize() {
        if (this.verbose) console.log("[PicoGym] PICO-8 initialized");
        this.initializationStatus = true;
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
            console.error("[PicoGym] A frame without input slipped by.");
            return 0;
        }
        return this.inputBuffer.shift();
    }

    getController() {
        if (!this.isInitialized) return 0;
        
        let input = this.popInputBuffer();
        if (this.verbose) console.log(`[PicoGym] Processing Controls: ${input}`);
        return input;
    }
      
    getCommands() {
        if (this.verbose && this.queuedCommands.length > 0)
            console.log(`[PicoGym] Processing Requests: ${this.queuedCommands}`);
        if (!this.isInitialized) {
          this.initialize();
        }
        return this.queuedCommands;
    }
      
    queueGameMessage(message) {
        if (this.verbose) console.log(`[PicoGym] Queued Game Message: ${JSON.stringify(message)}`);
        this.gameData.messages.push(message);
    }
      
    queueScreen(screen) {
        if (this.verbose) console.log("[PicoGym] Queue Screen");
        this.gameData.screen = screen;
    }

    sendGameData() {
        if (this.verbose) console.log("[PicoGym] Sent Game Data");
        // this.block();
        this.onSend(this.gameData);
        this.gameData = { messages: [] };
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
        if (data.input) {
            this.inputBuffer.push(data.input);
            if (this.isBlocking) this.unblock();
        }
        if (Array.isArray(data.commands)) {
            this.onReceiveCommands(data.commands);
        }
    }
}