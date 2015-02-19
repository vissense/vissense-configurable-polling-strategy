[![Build Status](https://api.travis-ci.org/vissense/vissense-configurable-polling-strategy.png?branch=master)](https://travis-ci.org/vissense/vissense-configurable-polling-strategy)
[![Coverage Status](https://coveralls.io/repos/vissense/vissense-configurable-polling-strategy/badge.png?branch=master)](https://coveralls.io/r/vissense/vissense-configurable-polling-strategy?branch=master)
[![Dependency Status](https://david-dm.org/vissense/vissense-configurable-polling-strategy.svg)](https://david-dm.org/vissense/vissense-configurable-polling-strategy)
[![devDependency Status](https://david-dm.org/vissense/vissense-configurable-polling-strategy/dev-status.svg)](https://david-dm.org/vissense/vissense-configurable-polling-strategy#info=devDependencies)

VisSense.js: Configurable Polling Strategy
====

A configurable polling strategy for [VisSense.js](https://github.com/vissense/vissense-configurable-polling-strategy).

Examples
===

Invoke a callback if an element has been visible at least 50% for 1 second:
```javascript
var element = $('#myElement'); 
var visibility = VisSense(element[0]);

var monitor = visibility.monitor({
  strategy: new VisSense.VisMon.Strategy.ConfigurablePollingStrategy({
    hidden: 9001,
    visible: 1042, // every 10 milliseconds
    fullyvisible: 1042
  }),
  update: function () {
    observer.callback();
  }
});
```

Contribute
------------

- Issue Tracker: https://github.com/vissense/vissense-configurable-polling-strategy/issues
- Source Code: https://github.com/vissense/vissense-configurable-polling-strategy

License
-------

The project is licensed under the MIT license. See
[LICENSE](https://github.com/vissense/vissense-configurable-polling-strategy/blob/master/LICENSE) for details.
