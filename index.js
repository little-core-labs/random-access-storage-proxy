const create = require('random-access-storage')
const assert = require('assert')

// used to restore proxy state when setting new proxy targets
const {
  _open: DEFAULT_OPEN,
  _close: DEFAULT_CLOSE,
  _destroy: DEFAULT_DESTROY,

  _write: NOT_WRITABLE,
  _read: NOT_READABLE,
  _stat: NOT_STATABLE,
  _del: NOT_DELETABLE,
} = create()

/**
 * A mapping of property states, plumbing & porcelain methods,
 * fallback functions, and argument ordering for state configuration
 * and restoration.
 * @private
 */
const map = [
  [ null, '_open', 'open', DEFAULT_OPEN, [] ],
  [ null, '_close', 'close', DEFAULT_CLOSE, [] ],
  [ null, '_destroy', 'destroy', DEFAULT_DESTROY, [] ],
  [ 'writable', '_write', 'write', NOT_WRITABLE, [ 'offset', 'data' ] ],
  [ 'readable', '_read', 'read', NOT_READABLE, [ 'offset', 'size'] ],
  [ 'statable', '_stat', 'stat', NOT_STATABLE, [] ],
  [ 'deletable', '_del', 'del', NOT_DELETABLE, [ 'offset', 'size' ] ],
]

/**
 * Proxy a random access storage object dynamically.
 * @public
 * @param {?(Object)} target
 * @return {RandomStorageAccess}
 */
function proxy(target) {
  const storage = create({  })

  Object.assign(storage, {
    setTarget(value) {
      assert(null !== value && 'object' === typeof value)
      target = value
      configure()
    },

    reset() {
      target = null
      configure()
    }
  })

  if (null !== target && 'object' === typeof target) {
    storage.setTarget(target)
  }

  return storage

  function configure() {
    for (const [ state, plumbing, porcelain, fallback, params ] of map) {
      if (null !== target && 'boolean' === typeof target[state]) {
        storage[state] = target[state]
        if (storage[state] && 'function' === typeof target[porcelain]) {
          storage[plumbing] = (req) => call(req, porcelain, params)
        } else {
          storage[plumbing] = fallback
        }
      } else if (null !== target && 'function' === typeof target[state]) {
        storage[plumbing] = (req) => call(req, porcelain, params)
      } else {
        storage[plumbing] = fallback
      }
    }
  }

  function call(req, method, params) {
    target[method](...params.map((k) => req[k]).concat(callback(req)))
  }

  function callback(req) {
    return (...args) => req.callback(...args)
  }
}

/**
 * Module exports.
 */
module.exports = proxy
