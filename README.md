# ddiff


[![npm (scoped)](https://img.shields.io/npm/v/ddiff.svg)](https://www.npmjs.com/package/ddiff)
[![Travis](https://img.shields.io/travis/thiamsantos/ddiff.svg)](https://travis-ci.org/thiamsantos/ddiff)
[![Coveralls](https://img.shields.io/coveralls/thiamsantos/ddiff.svg)](https://coveralls.io/github/thiamsantos/ddiff?branch=master)

> Calculate differences between two data structures

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com).
Go check them out if you don't have them locally installed.

```sh
$ npm install --save ddiff
```

The [UMD](https://github.com/umdjs/umd) build is also available on [jsdelivr](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/npm/vanilla-commons/dist/ddiff.umd.js"></script>
```

You can find the library on `window.ddiff`.

## Usage

```js
import {diff} from 'ddiff';

const lhs = {
  name: 'my object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'elements']
  }
};

const rhs = {
  name: 'updated object',
  description: 'it\'s an object!',
  details: {
    it: 'has',
    an: 'array',
    with: ['a', 'few', 'more', 'elements', { than: 'before' }]
};

diff(lhs, rhs);
// [ { kind: 'E',
//     path: [ 'name' ],
//     lhs: 'my object',
//     rhs: 'updated object' },
//   { kind: 'A',
//     path: [ 'details', 'with' ],
//     index: 2,
//     item: { kind: 'E', path: [], lhs: 'elements', rhs: 'more' } },
//   { kind: 'A',
//     path: [ 'details', 'with' ],
//     index: 3,
//     item: { kind: 'N', rhs: 'elements' } },
//   { kind: 'A',
//     path: [ 'details', 'with' ],
//     index: 4,
//     item: { kind: 'N', rhs: { than: 'before' } } } ]
```

### Changes

Change records have the following structure:

* `kind` - indicates the kind of change; will be one of the following:
  * `N` - indicates a newly added property/element
  * `D` - indicates a property/element was deleted
  * `E` - indicates a property/element was edited
  * `A` - indicates a change occurred within an array
* `path` - the property path (from the left-hand-side root)
* `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'N')
* `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')
* `index` - when kind === 'A', indicates the array index where the change occurred
* `item` - when kind === 'A', contains a nested change record indicating the change that occurred at the array index

## Credits

The test suite is adapted from [deep-diff](https://github.com/flitbit/diff). @flitbit Thanks for your amazing work.

## Contributing

See the [contributing file](CONTRIBUTING.md).

## License

[Apache License, Version 2.0](LICENSE.md) © [Thiago Santos](https://github.com/thiamsantos)