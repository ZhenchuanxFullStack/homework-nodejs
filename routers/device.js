const Router = require('koa-router')
const os = require('os')
const _ = require('lodash')
const ps = require('current-processes')

const device = new Router()

const getPs = ({sortBy = 'cpu'}) => {
  return new Promise((resolve, reject) => {
    ps.get((err, processes) => {
      if (err) {
        reject(err)
      }
      const sortedProcesses = _.sortBy(processes, sortBy)
      const result = sortedProcesses.reverse()
      resolve(result)
    })
  })
}

// /device
device.get('/', async (ctx, next) => {
  try {
    const processes = await getPs({sortBy: 'cpu'})
    ctx.response.status = 200
    ctx.response.body = {success: true, os, processes}
    await next()
  } catch (e) {
    ctx.response.status = 200
    ctx.response.body = {success: false, os: null, processes: null}
    await next()
  }
})

module.exports = device
