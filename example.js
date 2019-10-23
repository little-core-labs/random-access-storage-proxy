const ram = require('random-access-memory')
const proxy = require('./')

const memory = ram()
const first = proxy(memory)
const second = proxy(memory)

first.write(0, Buffer.from('hello'), (err) => {
  console.log(err);
  first.setTarget(ram())
  first.write(0, Buffer.from('bytes'), (err) => {
    first.read(0, 5, console.log)
  })
})
