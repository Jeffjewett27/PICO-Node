#!/usr/bin/env node

import websocket from 'websocket'
const WebSocketClient = websocket.client;
import { host, port, picoApi } from './config.js'
import { 
    Deferred,
    logError, 
    logConnecting, 
} from './utils.js'

function createPicoRequester(sender) {
    const requester = {
        incoming: null,
        pico(data) {
            console.log("TRY SEND")
            // new incoming message on the way
            const incoming = requester.incoming = new Deferred()
            sender(data)
            return incoming.promise
        }
    }
    
    return requester
  }

export function socketConnectAndGetRequester() {
    logConnecting('Websocket', `ws://${host}:${port}`)
    
    const connect = new Deferred()
    const client = new WebSocketClient()

    client.on('connect', connection => connect.resolve(connection))
    client.on('connectFailed', err => connect.reject(err))

    client.connect(picoApi)
    return connect.promise.then((conn) => {
        let connection = conn;
        let requester = createPicoRequester(data => {
            connection.sendUTF(data)
            // console.log("SENDING UTF")
        })
        connection.on('message', message => requester.incoming.resolve(message))
        return requester;
    })
}

export function socketSend(requester, msg, callback) {
    // console.log("SOCKET SEND")
    try {
        // const requester = createPicoRequester(data => connection.sendUTF(data))
        // connection.on('message', message => requester.incoming.resolve(message))

        const sendData = JSON.stringify({ pico: msg })
        requester.pico(sendData).then((message) => {
            console.log(`[Client] Received ${message.utf8Data}`);
            const data = JSON.parse(message.utf8Data)
            callback(data);
        })
        
    } catch(err) {
        logError(err)
    }
}

// export async function runPicoTest(msgObj) {
    
//     console.log("connected");

//     try {
//         const connection = await connect.promise
        
//         const requester = createPicoRequester(data => connection.sendUTF(data))
//         connection.on('message', message => requester.incoming.resolve(message))

//         await (async function asyncMessage() {
//             console.log("async message")
//             const sendData = JSON.stringify({ pico: msgObj.message })
//             const message = await requester.pico(sendData)
//             const data = JSON.parse(message.utf8Data)
//             const pico = data.pico

//             console.log(`received '${pico}'`);
//         })()

//         // https://www.iana.org/assignments/websocket/websocket.xhtml#close-code-number
//         connection.close(1000, 'Done testing')
        
//     } catch(err) {
//         logError(err)
//     }
// }

import * as url from 'node:url';

if (import.meta.url.startsWith('file:')) { // (A)
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) { // (B)
    // Main ESM module
    runPicoTest();
  }
}