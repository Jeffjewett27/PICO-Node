import chalk from 'chalk'

// Would be great to have Promise.defer :_(
export class Deferred {
  resolve = null
  reject = null
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export function createRequester(sender) {
  const requester = {
      incoming: null,
      greeting(data) {
          // new incoming message on the way
          const incoming = requester.incoming = new Deferred()
          sender(data)
          return incoming.promise
      }
  }
  
  return requester
}

export function round(number, fraction=2) {
  return number.toFixed(fraction)
}

export const log = console.log

export function logConnecting(client, url, serverByPort=true) {
  let message = ''
  const clientConnectingTo = `${chalk.green(client)} client connecting to`
  if (serverByPort) {
    const port = url.match(/:(\d+)/)[1]
    const server = 'Eventlet'
    const serverOn = `${chalk.cyan(server)} on`
    message = `${clientConnectingTo} ${serverOn} ${chalk.yellow(url)}`
  } else {
    message = `${clientConnectingTo} ${chalk.yellow(url)}`
  }

  log(message)
}

export function logError(err) {
  log(chalk.red(`${err}`))
}

export function range(start=0, end) {
  const [s, e] = typeof end === 'undefined' ? [0, start] : [start, end]
  return [...Array(e-s).keys()].map(i => s + i)
}