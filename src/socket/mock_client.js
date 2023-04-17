export function socketConnectAndGetRequester() {
    console.log("Connecting mock client");
    return new Promise((resolve, _) => {
        resolve({ mock: true });
    });
}

export function socketSend(_, message, callback) {
    console.log(`[Mock] ${message.screen}`);
    let data = {
        input: 3
    }
    setTimeout(()=>callback(data), 1000);
    // setImmediate(()=>callback(data))
}