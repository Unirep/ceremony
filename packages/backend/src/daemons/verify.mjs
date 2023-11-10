import * as snarkjs from 'snarkjs'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import crypto from 'crypto'

const TIMEOUT = 70000
const args = process.argv.slice(2)

function formatHash(b) {
  if (!b) return null
  const a = new DataView(b.buffer, b.byteOffset, b.byteLength)
  let S = ''
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      S += a
        .getUint32(i * 16 + j * 4)
        .toString(16)
        .padStart(8, '0')
    }
  }
  return S
}

try {
  setTimeout(() => {
    console.log('Timed out verifying', ...args)
    process.exit(1)
  }, TIMEOUT)
  // console.log('verifying', ...args)
  const mpcParams = await snarkjs.zKey.verifyFromInit(...args)

  if (!mpcParams) {
    console.log('no mpcParams')
    process.exit(1)
  }

  const data = JSON.stringify({
    contributions: mpcParams.contributions.map((c) => ({
      contributionHash: formatHash(c.contributionHash),
      name: c.name,
    })),
  })
  const name = `${crypto.randomBytes(32).toString('hex')}.json`
  const filepath = path.join(os.tmpdir(), name)
  await fs.writeFile(filepath, data)

  process.send(
    {
      filepath,
    },
    (err) => {
      if (err) {
        console.log(err)
        console.log('error sending ipc message')
      }
      process.exit(0)
    }
  )
} catch (err) {
  console.log(err)
  process.exit(1)
}
