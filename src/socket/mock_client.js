export function socketConnect() {
    console.log("Connecting mock client");
    return {
        client: null,
        connectPromise: new Promise((resolve, _) => {
            resolve({ mock: true });
        })
    };
}

export function socketSend(_, message, callback) {
    // console.log(`[Mock] ${message.screen}`);
    let data = {
        input: 3
    }
    setTimeout(()=>callback(data), 1);
    // setImmediate(()=>callback(data))
}