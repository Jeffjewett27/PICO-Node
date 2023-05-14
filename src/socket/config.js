import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    type: 'integer',
    description: 'Server socket port'
  })
  .option('id', {
    alias: 'i',
    type: 'string',
    description: 'Id for the instance'
  })
  .option('host', {
    alias: 'h',
    type: 'string',
    description: 'Host ip'
  }).argv

console.log(argv);
export const { 
    port = 5001, 
    host = '0.0.0.0',
    iters = 10000,
    repeat = 3,
    id = ''
} = argv

console.log(port);

export const wsApi = `ws://${host}:${port}/greeting`
export const picoApi = `ws://${host}:${port}/pico`