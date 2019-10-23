const test = require('tape')
const ras = require('random-access-storage')
const ram = require('random-access-memory')

const proxy = require('./')

test('proxy([target])', (t) => {
  {
    const hello = Buffer.from('hello')
    const goodbye = Buffer.from('goodbye')

    const memory = ram()
    const a = proxy(memory)
    const b = proxy(memory)
    a.write(0, hello, (err) => {
      t.notOk(err)
      b.read(0, hello.length, (err, buffer) => {
        t.notOk(err)
        t.ok(0 === Buffer.compare(buffer, hello))
        const c = proxy(b)
        c.read(0, hello.length, (err, buffer) => {
          t.notOk(err)
          t.ok(0 === Buffer.compare(buffer, hello))
          c.reset()
          c.write(0, goodbye, (err) => {
            t.ok(err)
            c.setTarget(ram())
            c.write(0, goodbye, (err) => {
              t.notOk(err)
              c.read(0, goodbye.length, (err, buffer) => {
                t.notOk(err)
                t.ok(0 === Buffer.compare(buffer, goodbye))
                a.read(0, hello.length, (err, buffer) => {
                  t.notOk(err)
                  t.ok(0 === Buffer.compare(buffer, hello))
                  b.read(0, hello.length, (err, buffer) => {
                    t.notOk(err)
                    t.ok(0 === Buffer.compare(buffer, hello))
                    t.end()
                  })
                })
              })
            })
          })
        })
      })
    })
  }
})
