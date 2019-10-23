random-access-storage-proxy
===========================

> Proxy [random access storage][ras] requests dynamically.

## Installation

```sh
$ npm install random-access-storage-proxy
```

## Usage

```js
const storage = proxy([target])
```

## API

### `storage = proxy([target])`

Creates a proxy [random access storage][ras] object that dynamically
proxies `open()`, `close()`, `destroy()`, `read()`, `write()`, `stat()`,
and `del()` requests to `target`, if given. If `target` is not given, a
target can be set with [`storage.setTarget(target)`](#storage-set-proxy).

Storage state properties like `writable`, `readable`, `statable`, and
`deletable` are configured to match the `target` state properties. Proxy
implementation methods like `_write()`, `_read()`, `_stat()`, and `_del`
are set to the original default implementation for a
[random-access-storage][ras] object when `target` lacks one.

**Example:**

```js
// initialize proxy with 'random-access-storage'
const store = proxy(ram())

// initialize proxy to target read only storage
store.setTarget(raf('path/to/file', { writable: false }))
```

<a name="storage-set-proxy"></a>
#### `storage.setTarget(target)`

Sets proxy target, reconfigures and restore storage state properties and
methods.

```js
store.setTarget(ram())
store.setTarget(raf(filename))
store.setTarget(rah(url))
```

#### `storage.reset()`

Resets the proxy storage state to the default
[random-access-storage][ras] implementation state.

```js
storage.reset()
```

## License

MIT


[ras]: https://github.com/random-access-storage/random-access-storage
