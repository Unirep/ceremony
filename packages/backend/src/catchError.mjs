export const catchError = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    console.log('Uncaught error in http handler')
    console.log(err)
    try {
      // try to send a 500
      // the response has already started just silently fail
      res.status(500).end({ error: 'uncaught error' })
    } catch (_) {}
  }
}

export const catchErrorWs =
  (fn) =>
  async (...args) => {
    const [, send] = args
    try {
      await fn(...args)
    } catch (err) {
      console.log('Uncaught error in ws handler')
      console.log(err)
      send('uncaught error', 2)
    }
  }
