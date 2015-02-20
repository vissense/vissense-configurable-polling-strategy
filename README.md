[![Build Status](https://api.travis-ci.org/vissense/vissense-configurable-polling-strategy.png?branch=master)](https://travis-ci.org/vissense/vissense-configurable-polling-strategy)
[![Coverage Status](https://coveralls.io/repos/vissense/vissense-configurable-polling-strategy/badge.png?branch=master)](https://coveralls.io/r/vissense/vissense-configurable-polling-strategy?branch=master)
[![Dependency Status](https://david-dm.org/vissense/vissense-configurable-polling-strategy.svg)](https://david-dm.org/vissense/vissense-configurable-polling-strategy)
[![devDependency Status](https://david-dm.org/vissense/vissense-configurable-polling-strategy/dev-status.svg)](https://david-dm.org/vissense/vissense-configurable-polling-strategy#info=devDependencies)

VisSense.js: Configurable Polling Strategy
====

A configurable polling strategy for [VisSense.js](https://github.com/vissense/vissense-configurable-polling-strategy).

This plugin aims to provide a more advanced polling strategy than the base library.

It has an external dependency to [Again.js](https://github.com/theborakompanioni/againjs).

Examples
===

Update a monitor on provided intervals depending on the current state.
```javascript
var element = document.getElementById('myElement');

var monitor = VisSense(element).monitor({
  strategy: new VisSense.VisMon.Strategy.ConfigurablePollingStrategy({
    hidden: 9001, // over 9000!
    visible: 1042, // 1000ms + the meaning of life
    fullyvisible: 666 // number of the beast
  }),
  update: function (monitor) {
    observer.callback(monitor);
  }
}).start();
```
This monitor will be updated every 9 seconds when the element is
`hidden`, every second when it is `visible` and
every ~700 milliseconds when it is `fullyvisible`.

Contribute
------------

- Issue Tracker: https://github.com/vissense/vissense-configurable-polling-strategy/issues
- Source Code: https://github.com/vissense/vissense-configurable-polling-strategy

License
-------

The project is licensed under the MIT license. See
[LICENSE](https://github.com/vissense/vissense-configurable-polling-strategy/blob/master/LICENSE) for details.
