export const HTTP_SERVER = process.env.HTTP_SERVER
  ? process.env.HTTP_SERVER.startsWith('http')
    ? process.env.HTTP_SERVER
    : `https://${process.env.HTTP_SERVER}`
  : null

export const ENDS_AT = process.env.ENDS_AT
  ? new Date(parseInt(process.env.ENDS_AT))
  : new Date(10 ** 13)
