import os from 'os'
import child_process from 'child_process'
import url from 'url'
import path from 'path'
import fs from 'fs/promises'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

class ThreadManager {
  maxThreads = Math.max(1, os.cpus().length - 1)
  index = 0

  constructor() {
    console.log(`${this.maxThreads} verification threads`)
    this.promises = Array(this.maxThreads)
      .fill()
      .map(() => Promise.resolve())
  }

  async verify(...args) {
    const rootPromise = this.promises[this.index]
    const thisPromise = rootPromise.then(
      () =>
        new Promise((rs, rj) => {
          const p = child_process.fork(path.join(__dirname, 'verify.mjs'), args)
          let receivedMsg = false
          p.on('message', async (msg) => {
            try {
              receivedMsg = true
              const { filepath } = msg
              const data = await fs.readFile(filepath)
              rs(JSON.parse(data.toString()))
              fs.rm(filepath).catch((err) =>
                console.log(`Error deleting json verification file`, err)
              )
            } catch (err) {
              console.log('unexpected error in verifier message handler')
              console.log(err)
              rj(err)
            }
          })
          p.on('exit', (code) => {
            if (!receivedMsg && code === 0) {
              console.log('exited 0 without receiving msg!')
              rj(new Error('verification process exited without msg'))
            }
            if (code !== 0) rj(new Error('zkey verification failed'))
          })
        })
    )
    this.promises[this.index] = thisPromise.catch(console.log)
    this.index = (this.index + 1) % this.maxThreads
    return thisPromise
  }
}

export default new ThreadManager()
