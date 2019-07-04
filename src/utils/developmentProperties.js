const develpment = 'test'

function checkDevalpment() {
  let addr = ''
  switch (develpment) {
    case 'test':
      addr = 'goufanguat.lybrc.com.cn'
      break
    default:
      addr = ''
      break
  }
  addr = global.location.origin
  return addr
}

exports.env = develpment

// 生产环境去除 console
if (develpment === 'prd') {
  global.console.log = () => {}
  global.console.error = () => {}
  global.console.warn = () => {}
}

const gift = 'agent'

// main
exports.mainDevelopment = function buildDevelopment() {
  let dev = checkDevalpment()
  let res = `${dev}/${gift}main/a`
  return res
}

// sys
exports.sysDevelopment = function sysDevelopment() {
  let dev = checkDevalpment()
  let res = `${dev}/${gift}_sys/a`
  return res
}

// pic
exports.picDevelopment = function sysDevelopment() {
  let dev = checkDevalpment()
  let res = `${dev}/${gift}main`
  return res
}


